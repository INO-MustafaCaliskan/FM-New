import Image from "next/image";

const InoLoading = () => {
    return (
        <div className="app-loading-container">
            <div className="app-loading-content">
                <div id="app-loading">
                    <Image src="/images/fm_loading.png" alt="Freight Talk Bird Loading" priority width={30} height={30} unoptimized/>
                    <div className="lds-roller">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InoLoading