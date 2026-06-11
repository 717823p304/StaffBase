package com.staffbase.service;

public interface EmailService {
    void sendPasswordResetEmail(String toEmail, String resetLink);
    void sendAccountApprovalEmail(String toEmail, String name);
    void sendAccountRejectionEmail(String toEmail, String name);
}
