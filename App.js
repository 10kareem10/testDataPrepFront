//App.js
import React from 'react';
import Navbar from './Navbar';
import InputComponent from './inputComponent';
import ListOfServicesComponent  from './ListOfServicesComponent'
import OnboardingPage from './Pages/OnboardingPage';
import CustomOnboarding from './Pages/CustomOnboardingPage'
import Transfer from './Pages/TransferPage'
import DepositsPage from './Pages/DepositsPage';
import MobileDepositsPage from './Pages/MobileDepositsPage'
import RegisterComponent from './RegisterComponent';
import LoginComponent from './LoginComponent';
import AddCustomerRestrictionsComponent from './AddCustomerRestrictionsComponent';
import AddAccountRestrictionsComponent from './AddAccountRestrictionsComponent';
import UpdateCardStatusComponent from './UpdateCardStatusComponent';
import './App.css'; // Ensure your existing styles are included
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminDashboardComponent from './AdminDashboardComponent';
import AddRestrictionsComponent from './AddRestrictionsComponent';

// import bodyPic from './bodypic.jpg' // replace with your own path

const App = () => {
    return (
        <Router>
                    <Routes>
                        
                        <Route path="/register" element={<RegisterComponent/>}/>
                         <Route path="/" element={<LoginComponent/>}/>
                        <Route path="/login" element={<LoginComponent/>}/>
                        <Route path="/user-stats" element={<AdminDashboardComponent/>}/>

                        
                        <Route path="/homepage" element={
                            <ProtectedRoute>
                             <ListOfServicesComponent />
                            </ProtectedRoute>
                        } />
                        <Route path="/onboarding" element={
                            <ProtectedRoute>
                             <OnboardingPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/customonboarding" element={
                            <ProtectedRoute>
                             <CustomOnboarding />
                            </ProtectedRoute>
                        } />
                        <Route path="/transfer" element={
                            <ProtectedRoute>
                             <Transfer />
                            </ProtectedRoute>
                        } />
                        <Route path="/ordervcn" element={
                            <ProtectedRoute>
                             <DepositsPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/depositsMobile" element={
                            <ProtectedRoute>
                             <MobileDepositsPage />
                            </ProtectedRoute>
                        } />
                          <Route path="/addRestrictions" element={
                    <ProtectedRoute>
                        <AddRestrictionsComponent/>
                    </ProtectedRoute>
                } />
                 <Route path="/addCustomerRestrictions" element={
                    <ProtectedRoute>
                        <AddCustomerRestrictionsComponent />
                    </ProtectedRoute>
                } />
                   <Route path="/addAccountRestrictions" element={
                    <ProtectedRoute>
                        <AddAccountRestrictionsComponent />
                    </ProtectedRoute>
                } />
                   <Route path="/updateCardStatus" element={
                    <ProtectedRoute>
                        <UpdateCardStatusComponent />
                    </ProtectedRoute>
                } />

                    </Routes>
        </Router>

    );
};

export default App