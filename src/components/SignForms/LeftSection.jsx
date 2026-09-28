import InoLink from "@/components/InoLink/InoLink";
import { Image } from "react-bootstrap";
import { LuBlinds, LuGlobe, LuShieldCheck, LuUsers } from "react-icons/lu";

export default function LeftSection() {
  return (
        <div className="login__promotion">
          <InoLink
            hrefLink={"/"}
            className={"login__promotion-logo"}
            element={
              <Image
                src="/images/FM_Logo.png"
                alt="Freight Talk"
                height={60}
                width={196}
              />
            }
          />
          <h2 className="login__promotion-title">
            JOIN THE GLOBAL <br/>
            <span style={{color : '#fe690e'}}>FREIGHT BUSINESS <br/>
            DEVELOPMENT <br/>
            </span>
            COMMUNITY
          </h2>

          <p className="login__promotion-text">
            Meet freight forwarders, logistics and supply chain professionals <span style={{color : '#fe690e'}}>face-to-face online </span>
            and develop business globally in real time.
          </p>

          <p className="login__promotion-subtext d-flex align-items-center">
              <span style={{background:'#f97a29', color:'#fff', borderRadius:'50%', padding:'4px', display:'inline-flex', alignItems:'center'}}>
                <LuUsers size={18} color="#fff"  />
              </span>
              <span style={{marginLeft:'8px'}}>
                One-to-One Online Meetings
              </span>
          </p>
          <p className="login__promotion-subtext d-flex align-items-center">
            <span style={{background:'#f97a29', color:'#fff', borderRadius:'50%', padding:'4px', display:'inline-flex', alignItems:'center'}}>
              <LuBlinds size={18} />
            </span>
            <span style={{marginLeft:'8px'}}>
              Exchange RFQs & Get Quotes
            </span>
          </p>
          <p className="login__promotion-subtext d-flex align-items-center">
            <span style={{background:'#f97a29', color:'#fff', borderRadius:'50%', padding:'4px', display:'inline-flex', alignItems:'center'}}>
              <LuGlobe size={18} />
            </span>
            <span style={{marginLeft:'8px'}}>
              Global Business Development
            </span>
          </p>
          <p className="login__promotion-subtext d-flex align-items-center">
            <span style={{background:'#f97a29', color:'#fff', borderRadius:'50%', padding:'4px', display:'inline-flex', alignItems:'center'}}>
              <LuShieldCheck size={18} />
            </span>
            <span style={{marginLeft:'8px'}}>
              Safe, Secure & Verified
            </span>
          </p>
        </div>
  )
}
