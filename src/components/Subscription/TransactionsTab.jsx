import React, { useEffect, useState } from 'react'
import client from '@/utils/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { CircularProgress } from '@mui/material';
import HumanizedDate from '../UI/HumanizedDate ';
import InoPagination from '../UI/InoPagination';

const PAGE_SIZE = 10;
let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

const downloadInvoice = async (invoiceId) => {
    try {
      const response = await client.get(`UserTransaction/GetInvoiceByTransactionId/` + invoiceId, {
        headers: {
          'Content-Type': 'application/html',
        },
        responseType: 'blob',
      });

      if (response.status !== 200) {
        throw new Error('Invoice could not be fetched.');
      }

      // Yanıtı blob'a dönüştür
      const blob = await response.data;

      // Blob'dan bir URL oluştur
      const url = window.URL.createObjectURL(blob);

      // <a> etiketi oluştur ve tıklanabilir hale getir
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceId}.html`; // Dosya adı ve uzantısı
      document.body.appendChild(a);
      a.click();

      // Kaynakları temizle
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading the invoice:', error);
    }
  };

export const TransactionsTab = () => {
    const [transactionsData, setTransactionsData] = useState(null)
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchData();
    }, [pageNumber])

    const fetchData = () => {
        setLoading(true)
        client.get('UserTransaction/GetListForLoginUser?pageSize=' + PAGE_SIZE + '&pageNumber=' + pageNumber)
            .then((response) => {
                
                setTransactionsData(response.data.data)
            })
            .catch((error) => {
                console.error(error)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    if(loading || !transactionsData){
        return <div className='d-flex justify-content-center align-items-center p-5'><CircularProgress /></div>
    }

  return (
    <>
        <div className='col-12 table-responsive'>
            <table className='table table-striped rounded overflow-hidden mt-4 transaction-table'>
                <thead>
                    <tr>
                        <th scope='col' className="text-nowrap">Transaction Date</th>
                        <th scope='col' className="text-nowrap">Payment Status</th>
                        <th scope='col' className="text-nowrap">Purpose of Payment</th>
                        <th scope='col' className="text-nowrap">Total</th>
                        <th scope='col' className="text-nowrap">&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        transactionsData.listItems.map( transaction => {
                            return (
                                <tr key={transaction.id}>
                                    <td className="align-middle">{<HumanizedDate dateString={transaction.transactionDate} showHours={true} />}</td>
                                    <td className="align-middle">{transaction.paymentStatusName}</td>
                                    <td className="align-middle">{transaction.purposeOfPayment}</td>
                                    <td className="align-middle">{USDollar.format(transaction.total)}</td>
                                    <td className="align-middle">
                                        <a href='#' title='Download' className={transaction.paymentStatus !== 2 ? "disabled-link" : ""} onClick={() => {
                                            downloadInvoice(transaction.id)
                                        }} ><FontAwesomeIcon icon={faDownload} /></a>
                                    </td>
                                </tr>
                            )
                        })
                    }

                </tbody>
            </table>
        </div>
        <div className='mt-3  d-flex justify-content-center align-items-center'>
            <InoPagination currentPage={transactionsData.currentPage} totalPage={transactionsData.totalPage} onPageChange={(page) => setPageNumber(page) } />
        </div>
    </>
  )
}
