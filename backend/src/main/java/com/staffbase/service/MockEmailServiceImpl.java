package com.staffbase.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class MockEmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(MockEmailServiceImpl.class);

    @Override
    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        logger.info("\n==================================================" +
                    "\n[MOCK EMAIL DISPATCH - PASSWORD RESET]" +
                    "\nTo: " + toEmail +
                    "\nSubject: Password Reset Request - StaffBase" +
                    "\nBody: A password reset request has been received. Please click " +
                    "the link below to reset your credentials. The link will expire in 15 minutes." +
                    "\nLink: " + resetLink +
                    "\n==================================================");
    }

    @Override
    public void sendAccountApprovalEmail(String toEmail, String name) {
        logger.info("\n==================================================" +
                    "\n[MOCK EMAIL DISPATCH - ACCOUNT APPROVED]" +
                    "\nTo: " + toEmail +
                    "\nSubject: Corporate Profile Approved - StaffBase" +
                    "\nBody: Welcome, " + name + "! Your credentials request has been " +
                    "reviewed and approved by HR Operations. Your account is now active. " +
                    "You can log in at http://localhost:5173 using your registered email." +
                    "\n==================================================");
    }

    @Override
    public void sendAccountRejectionEmail(String toEmail, String name) {
        logger.info("\n==================================================" +
                    "\n[MOCK EMAIL DISPATCH - ACCOUNT REJECTED]" +
                    "\nTo: " + toEmail +
                    "\nSubject: Credentials Request Rejected - StaffBase" +
                    "\nBody: Hello " + name + ", we regret to inform you that your request " +
                    "for a corporate profile access credential has been rejected by HR Operations." +
                    "\n==================================================");
    }
}
