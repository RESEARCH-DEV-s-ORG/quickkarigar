package in.researchdevs.quickkarigar.data.repository;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Patterns;

import in.researchdevs.quickkarigar.data.local.SessionManager;

public class AuthRepository {

    private SessionManager sessionManager;
    private Handler handler = new Handler(Looper.getMainLooper());

    public AuthRepository(Context context) {
        sessionManager = new SessionManager(context);
    }

    // ================= COMMON =================
    private void handleSuccess(String token, AuthCallback callback) {
        sessionManager.saveToken(token);
        if (callback != null) callback.onSuccess();
    }

    private void handleError(String message, AuthCallback callback) {
        if (callback != null) callback.onError(message);
    }

    // ================= GOOGLE =================
    public void loginWithGoogle(String idToken, AuthCallback callback) {
        handler.postDelayed(() -> {
            if (idToken != null && !idToken.isEmpty()) {
                handleSuccess("google_fake_token", callback);
            } else {
                handleError("Google login failed", callback);
            }
        }, 1200);
    }

    // ================= TRUECALLER =================
    public void loginWithTruecaller(String authCode, AuthCallback callback) {

        handler.postDelayed(() -> {
            if (authCode != null && !authCode.isEmpty()) {
                handleSuccess("truecaller_fake_token", callback);
            } else {
                handleError("Truecaller login failed", callback);
            }
        }, 1200);
    }

    // ================= PHONE OTP =================
    public void requestPhoneOtp(String phone, AuthCallback callback) {

        handler.postDelayed(() -> {
            if (phone == null || phone.isEmpty()) {
                handleError("Phone number required", callback);
                return;
            }

            if (phone.length() != 10) {
                handleError("Enter valid 10-digit phone number", callback);
                return;
            }

            // simulate success
            if (callback != null) callback.onSuccess();

        }, 1000);
    }

    public void verifyPhoneOtp(String phone, String otp, AuthCallback callback) {

        handler.postDelayed(() -> {

            if (otp == null || otp.length() != 6) {
                handleError("Enter valid 6-digit OTP", callback);
                return;
            }

            if (!otp.equals("123456")) {
                handleError("Invalid OTP", callback);
                return;
            }

            handleSuccess("phone_fake_token", callback);

        }, 1200);
    }

    // ================= EMAIL OTP =================
    public void requestEmailOtp(String email, AuthCallback callback) {

        handler.postDelayed(() -> {

            if (email == null || email.isEmpty()) {
                handleError("Email required", callback);
                return;
            }

            if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                handleError("Enter valid email", callback);
                return;
            }

            if (callback != null) callback.onSuccess();

        }, 1000);
    }

    public void verifyEmailOtp(String email, String otp, AuthCallback callback) {

        handler.postDelayed(() -> {

            if (otp == null || otp.length() != 6) {
                handleError("Enter valid 6-digit OTP", callback);
                return;
            }

            if (!otp.equals("123456")) {
                handleError("Invalid OTP", callback);
                return;
            }

            handleSuccess("email_fake_token", callback);

        }, 1200);
    }

    // ================= SIGN UP =================
    public void signUp(
            String name,
            String email,
            String phone,
            String password,
            AuthCallback callback
    ) {

        handler.postDelayed(() -> {

            if (name == null || name.trim().isEmpty()) {
                handleError("Enter full name", callback);
                return;
            }

            if (email == null || !Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                handleError("Enter valid email", callback);
                return;
            }

            if (phone == null || phone.length() != 10) {
                handleError("Enter valid phone number", callback);
                return;
            }

            if (password == null || password.length() < 6) {
                handleError("Password must be at least 6 characters", callback);
                return;
            }

            // simulate API success
            handleSuccess("signup_fake_token", callback);

        }, 1500);
    }

    // ================= SESSION =================
    public boolean isLoggedIn() {
        return sessionManager.isLoggedIn();
    }

    public String getToken() {
        return sessionManager.getToken();
    }

    public void logout() {
        sessionManager.logout();
    }
}