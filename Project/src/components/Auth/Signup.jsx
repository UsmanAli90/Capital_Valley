import { useState } from "react"
import StartupForm from "./StartupForm";
import InvestorForm from "./InvestorForm";
import { Link } from 'react-router-dom';

function Signup() {
    const [usertype, steusertype] = useState('startup');
    const handleuser = (type) => {
        steusertype(type)
    }
    return (
        <div className=" bg-green-200 ">
            <div className="container d-flex align-items-center">
                <div className="row w-100">
                    <div className="mx-auto p-4 shadow rounded">
                        <div className="d-flex justify-content-between mb-3">
                            <div>
                                <input
                                    type="checkbox"
                                    id="startup-checkbox"
                                    checked={usertype === 'startup'}
                                    onChange={() => handleuser('startup')}
                                />
                                <label className="ms-2" htmlFor="startup-checkbox">Startup Founder</label>
                            </div>
                            <div>
                                <input
                                    type="checkbox"
                                    id="investor-checkbox"
                                    checked={usertype === 'investor'}
                                    onChange={() => handleuser('investor')}
                                />
                                <label className="ms-2" htmlFor="investor-checkbox">Investor</label>
                            </div>
                        </div>
                        <h2 className="text-center mb-3">Welcome to <b> Capital Valley</b></h2>
                        <div className="mt-3 fs-5 text-center ">
                            <span className="">Already have an account? </span>
                            <Link to="/signin" className="text-decoration-none">
                                Login
                            </Link>
                        </div>

                        {usertype === 'startup' ? (
                            <StartupForm usertype={usertype} />
                        ) : (
                            <InvestorForm usertype={usertype} />
                        )}
                    </div>

                </div>
            </div>
        </div>
    );


}

export default Signup