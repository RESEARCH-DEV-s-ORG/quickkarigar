package in.researchdevs.quickkarigar;

import android.app.Dialog;
import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Patterns;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;


import com.truecaller.android.sdk.oAuth.TcOAuthCallback;
import com.truecaller.android.sdk.oAuth.TcOAuthData;
import com.truecaller.android.sdk.oAuth.TcOAuthError;
import com.truecaller.android.sdk.oAuth.TcSdk;
import com.truecaller.android.sdk.oAuth.TcSdkOptions;
import com.truecaller.android.sdk.oAuth.CodeVerifierUtil;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.SecureRandom;

import in.researchdevs.quickkarigar.data.repository.AuthCallback;
import in.researchdevs.quickkarigar.data.repository.AuthRepository;


public class LoginActivity extends BaseActivity {

    private GoogleSignInClient mGoogleSignInClient;
    private static final int RC_SIGN_IN = 1001;
    private String stateRequested;
    private String codeVerifier;
    private AuthRepository authRepository;

    // Truecaller Launcher
    private ActivityResultLauncher<Intent> tcLauncher =
            registerForActivityResult(
                    new ActivityResultContracts.StartActivityForResult(),
                    result -> TcSdk.getInstance().onActivityResultObtained(
                            LoginActivity.this,
                            result.getResultCode(),
                            result.getData()
                    )
            );

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_login);

        View root = findViewById(R.id.login_screen);
        root.setOnApplyWindowInsetsListener((v, insets) -> {
            int top = insets.getSystemWindowInsetTop();
            int bottom = insets.getSystemWindowInsetBottom();
            v.setPadding(0, top, 0, bottom);
            return insets;
        });

        authRepository = new AuthRepository(this);

        // Inside your onCreate or a setup method
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .requestIdToken(getString(R.string.google_web_client_id))
                .build();
        mGoogleSignInClient = GoogleSignIn.getClient(this, gso);

        findViewById(R.id.googleButton).setOnClickListener(v -> signInWithGoogle());
        findViewById(R.id.phoneButton).setOnClickListener(v -> showPhoneDialog());
        findViewById(R.id.emailButton).setOnClickListener(v -> showEmailDialog());

        findViewById(R.id.signUpActivityBtn).setOnClickListener(v -> {
            Intent intent = new Intent(LoginActivity.this, SignUpActivity.class);
            startActivity(intent);

            overridePendingTransition(
                    android.R.anim.fade_in,
                    0
            );
        });

        TcSdkOptions options = new TcSdkOptions.Builder(this, tcOAuthCallback)
                .buttonColor(ContextCompat.getColor(this, R.color.primary))
                .buttonTextColor(android.graphics.Color.WHITE)
                .loginTextPrefix(TcSdkOptions.LOGIN_TEXT_PREFIX_TO_GET_STARTED)
                .ctaText(TcSdkOptions.CTA_TEXT_CONTINUE)
                .buttonShapeOptions(TcSdkOptions.BUTTON_SHAPE_ROUNDED)
                .footerType(TcSdkOptions.FOOTER_TYPE_SKIP)
                .sdkOptions(TcSdkOptions.OPTION_VERIFY_ONLY_TC_USERS)
                .build();

        // init in background
        new Thread(() -> TcSdk.init(options)).start();

        new android.os.Handler().postDelayed(() -> {
            startTruecallerFlow();
        }, 800); // 500–1000ms delay is safe
    }

    private void signInWithGoogle() {
        mGoogleSignInClient.signOut();
        Intent signInIntent = mGoogleSignInClient.getSignInIntent();
        startActivityForResult(signInIntent, RC_SIGN_IN);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == RC_SIGN_IN) {
            Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
            try {
                GoogleSignInAccount account = task.getResult(ApiException.class);

                authRepository.loginWithGoogle(account.getIdToken(), new AuthCallback() {
                    @Override
                    public void onSuccess() {
                        runOnUiThread(() -> {
                            // Auth Success
                            Toast.makeText(LoginActivity.this, "Login Success", Toast.LENGTH_SHORT).show();
                            // Navigate
                            startActivity(new Intent(LoginActivity.this, MainActivity.class));
                            finish();
                        });
                    }

                    @Override
                    public void onError(String message) {
                        runOnUiThread(() -> {
                            // Auth Error
                            Toast.makeText(LoginActivity.this, message, Toast.LENGTH_SHORT).show();
                        });
                    }
                });
            } catch (ApiException e) {
                Toast.makeText(this, "Google Sign-In Failed: " + e.getStatusCode(), Toast.LENGTH_LONG).show();
            }
        }
    }

    // ================= PHONE FLOW =================
    private void showPhoneDialog() {
        Dialog dialog = new Dialog(this, R.style.BottomDialogTheme);
        View view = LayoutInflater.from(this).inflate(R.layout.dialog_phone_input, null);
        dialog.setContentView(view);

        setupBottomDialog(dialog);

        EditText phoneInput = view.findViewById(R.id.phoneInput);
        Button btnContinue = view.findViewById(R.id.btnSendOtp);
        ProgressBar progress = view.findViewById(R.id.progressSendOtp);

        animateDialog(view);

        phoneInput.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {}
            @Override
            public void afterTextChanged(Editable s) {
                // Limit to 10 digits safely
                if (s.length() > 10) {
                    phoneInput.removeTextChangedListener(this);
                    phoneInput.setText(s.subSequence(0, 10));
                    phoneInput.setSelection(phoneInput.getText().length());
                    phoneInput.addTextChangedListener(this);
                    return;
                }
                // Validate phone
                boolean valid = s.length() == 10;
                // Enable / Disable button
                btnContinue.setEnabled(valid);
                btnContinue.setAlpha(valid ? 1f : 0.5f);
            }
        });

        btnContinue.setOnClickListener(v -> {
            String phone = phoneInput.getText().toString().trim();

            if (phone.length() != 10) {
                phoneInput.setError("Enter valid number");
                return;
            }

            btnContinue.setEnabled(false);
            btnContinue.setText("");
            progress.setVisibility(View.VISIBLE);


            authRepository.requestPhoneOtp(phone, new AuthCallback() {
                @Override
                public void onSuccess() {
                    // OTP Sent Successfully
                    progress.setVisibility(View.GONE);
                    btnContinue.setEnabled(true);
                    btnContinue.setText("Continue");
                    Toast.makeText(LoginActivity.this, "OTP Sent", Toast.LENGTH_SHORT).show();
                    dialog.dismiss();
                    showOtpDialog(phone);
                }
                @Override
                public void onError(String message) {
                    // Error Message
                    progress.setVisibility(View.GONE);
                    btnContinue.setEnabled(true);
                    btnContinue.setText("Continue");

                    Toast.makeText(LoginActivity.this, message, Toast.LENGTH_SHORT).show();
                }
            });
        });

        dialog.show();
    }

    private void showOtpDialog(String phone) {
        Dialog dialog = new Dialog(this, R.style.BottomDialogTheme);
        View view = LayoutInflater.from(this).inflate(R.layout.dialog_otp, null);
        dialog.setContentView(view);

        setupBottomDialog(dialog);

        LinearLayout otpContainer = view.findViewById(R.id.otpContainer);
        Button btnVerify = view.findViewById(R.id.btnVerify);
        TextView phoneDisplay = view.findViewById(R.id.phoneDisplay);

        phoneDisplay.setText("+91 " + phone);

        setupOtpInputs(otpContainer);
        animateDialog(view);

        handleOtpButtonState(otpContainer, btnVerify);

        ProgressBar progress = view.findViewById(R.id.btnLoader);
        TextView resendOtp = view.findViewById(R.id.resendOtp);
        startResendTimer(resendOtp, 60000);

        resendOtp.setOnClickListener(v -> {
            authRepository.requestPhoneOtp(phone, new AuthCallback() {
                @Override
                public void onSuccess() {
                    runOnUiThread(() -> {
                        Toast.makeText(LoginActivity.this, "OTP Resent", Toast.LENGTH_SHORT).show();
                        startResendTimer(resendOtp, 60000);
                    });
                }
                @Override
                public void onError(String message) {
                    runOnUiThread(() ->
                            Toast.makeText(LoginActivity.this, message, Toast.LENGTH_SHORT).show()
                    );
                }
            });
        });

        btnVerify.setOnClickListener(v -> {
            String otp = getOtpFromBoxes(otpContainer);

            if (otp.length() != 6) {
                Toast.makeText(this, "Enter 6-digit OTP", Toast.LENGTH_SHORT).show();
                shakeView(otpContainer);
                return;
            }

            btnVerify.setEnabled(false);
            btnVerify.setText("");
            progress.setVisibility(View.VISIBLE);

            authRepository.verifyPhoneOtp(phone, otp, new AuthCallback() {
                @Override
                public void onSuccess() {

                    progress.setVisibility(View.GONE);
                    btnVerify.setEnabled(true);
                    btnVerify.setText("Verify");

                    Toast.makeText(LoginActivity.this, "Login Success", Toast.LENGTH_SHORT).show();
                    dialog.dismiss();
                    startActivity(new Intent(LoginActivity.this, MainActivity.class));
                    finish();
                }
                @Override
                public void onError(String message) {
                    progress.setVisibility(View.GONE);
                    btnVerify.setEnabled(true);
                    btnVerify.setText("Verify");

                    Toast.makeText(LoginActivity.this, message, Toast.LENGTH_SHORT).show();
                    shakeView(otpContainer);
                }
            });
        });

        dialog.show();
    }

    // ================= EMAIL FLOW =================

    private void showEmailDialog() {
        Dialog dialog = new Dialog(this, R.style.BottomDialogTheme);
        View view = LayoutInflater.from(this).inflate(R.layout.dialog_email_input, null);
        dialog.setContentView(view);

        setupBottomDialog(dialog);

        EditText emailInput = view.findViewById(R.id.emailInput);
        Button btnContinue = view.findViewById(R.id.btnSendEmailOtp);
        ProgressBar progress = view.findViewById(R.id.progressEmailOtp);

        emailInput.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {}

            @Override
            public void afterTextChanged(Editable s) {
                boolean valid = Patterns.EMAIL_ADDRESS.matcher(s.toString()).matches();
                btnContinue.setEnabled(valid);
                btnContinue.setAlpha(valid ? 1f : 0.5f);
            }
        });

        animateDialog(view);

        btnContinue.setOnClickListener(v -> {
            String email = emailInput.getText().toString().trim();

            if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                emailInput.setError("Enter valid email");
                return;
            }

            btnContinue.setEnabled(false);
            btnContinue.setText("");
            progress.setVisibility(View.VISIBLE);


            authRepository.requestEmailOtp(email, new AuthCallback() {
                @Override
                public void onSuccess() {
                    runOnUiThread(() -> {
                        // STOP LOADING
                        progress.setVisibility(View.GONE);
                        btnContinue.setEnabled(true);
                        btnContinue.setText("Continue");

                        Toast.makeText(LoginActivity.this, "OTP Sent", Toast.LENGTH_SHORT).show();
                        dialog.dismiss();
                        showEmailOtpDialog(email);
                    });
                }

                @Override
                public void onError(String message) {
                    runOnUiThread(() -> {
                        // STOP LOADING
                        progress.setVisibility(View.GONE);
                        btnContinue.setEnabled(true);
                        btnContinue.setText("Continue");

                        Toast.makeText(LoginActivity.this, message, Toast.LENGTH_SHORT).show();
                    });
                }
            });
        });

        dialog.show();
    }

    private void showEmailOtpDialog(String email) {
        Dialog dialog = new Dialog(this, R.style.BottomDialogTheme);
        View view = LayoutInflater.from(this).inflate(R.layout.dialog_email_otp, null);
        dialog.setContentView(view);

        setupBottomDialog(dialog);

        LinearLayout otpContainer = view.findViewById(R.id.otpContainer);
        Button btnVerify = view.findViewById(R.id.btnVerifyEmail);
        TextView emailDisplay = view.findViewById(R.id.emailDisplay);
        ProgressBar progress = view.findViewById(R.id.progressVerifyEmail);
        TextView resendOtp = view.findViewById(R.id.resendOtpEmail);

        emailDisplay.setText(email);
        setupOtpInputs(otpContainer);
        animateDialog(view);

        startResendTimer(resendOtp, 60000);

        resendOtp.setOnClickListener(v -> {
            resendOtp.setEnabled(false); // prevent spam
            authRepository.requestEmailOtp(email, new AuthCallback() {
                @Override
                public void onSuccess() {
                    runOnUiThread(() -> {
                        Toast.makeText(LoginActivity.this, "OTP Resent", Toast.LENGTH_SHORT).show();
                        // restart timer
                        startResendTimer(resendOtp, 60000);
                    });
                }
                @Override
                public void onError(String message) {
                    runOnUiThread(() -> {
                        Toast.makeText(LoginActivity.this, message, Toast.LENGTH_SHORT).show();
                        resendOtp.setEnabled(true);
                    });
                }
            });
        });

        handleOtpButtonState(otpContainer, btnVerify);
        btnVerify.setOnClickListener(v -> {
            String otp = getOtpFromBoxes(otpContainer);

            if (otp.length() != 6) {
                Toast.makeText(this, "Enter 6-digit OTP", Toast.LENGTH_SHORT).show();
                shakeView(otpContainer);
                return;
            }

            // START LOADING
            btnVerify.setEnabled(false);
            btnVerify.setText("");
            progress.setVisibility(View.VISIBLE);

            authRepository.verifyEmailOtp(email, otp, new AuthCallback() {
                @Override
                public void onSuccess() {
                    runOnUiThread(() -> {
                        progress.setVisibility(View.GONE);
                        btnVerify.setEnabled(true);
                        btnVerify.setText("Verify");

                        Toast.makeText(LoginActivity.this, "Email Login Success", Toast.LENGTH_SHORT).show();
                        dialog.dismiss();
                        // Navigate
                        startActivity(new Intent(LoginActivity.this, MainActivity.class));
                        finish();
                    });
                }

                @Override
                public void onError(String message) {
                    runOnUiThread(() -> {
                        progress.setVisibility(View.GONE);
                        btnVerify.setEnabled(true);
                        btnVerify.setText("Verify");

                        Toast.makeText(LoginActivity.this, message, Toast.LENGTH_SHORT).show();
                        shakeView(otpContainer);
                    });
                }
            });
        });

        dialog.show();
    }

    // ================= COMMON OTP LOGIC =================

    private void setupOtpInputs(LinearLayout container) {
        for (int i = 0; i < container.getChildCount(); i++) {
            EditText current = (EditText) container.getChildAt(i);
            final int index = i;
            current.addTextChangedListener(new TextWatcher() {
                @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
                @Override public void onTextChanged(CharSequence s, int start, int before, int count) {}

                @Override
                public void afterTextChanged(Editable s) {

                    if (s.length() > 1) {
                        fillOtpFromPaste(container, s.toString());
                        return;
                    }

                    if (s.length() == 1 && index < container.getChildCount() - 1) {
                        container.getChildAt(index + 1).requestFocus();
                    }
                }
            });

            current.setOnKeyListener((v, keyCode, event) -> {
                if (keyCode == KeyEvent.KEYCODE_DEL &&
                        event.getAction() == KeyEvent.ACTION_DOWN) {

                    if (current.getText().toString().isEmpty() && index > 0) {
                        EditText prev = (EditText) container.getChildAt(index - 1);
                        prev.requestFocus();
                        prev.setText("");
                        return true;
                    }
                }
                return false;
            });
        }
    }

    private void handleOtpButtonState(LinearLayout container, Button btn) {
        btn.setEnabled(false);
        btn.setAlpha(0.5f);

        for (int i = 0; i < container.getChildCount(); i++) {
            EditText box = (EditText) container.getChildAt(i);

            box.addTextChangedListener(new TextWatcher() {
                @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
                @Override public void onTextChanged(CharSequence s, int start, int before, int count) {}

                @Override
                public void afterTextChanged(Editable s) {
                    String otp = getOtpFromBoxes(container);

                    if (otp.length() == 6) {
                        btn.setEnabled(true);
                        btn.setAlpha(1f);
                    } else {
                        btn.setEnabled(false);
                        btn.setAlpha(0.5f);
                    }
                }
            });
        }
    }

    private void fillOtpFromPaste(LinearLayout container, String otp) {
        int length = Math.min(otp.length(), container.getChildCount());
        for (int i = 0; i < length; i++) {
            EditText box = (EditText) container.getChildAt(i);
            box.setText(String.valueOf(otp.charAt(i)));
        }
        container.getChildAt(length - 1).requestFocus();
    }

    private String getOtpFromBoxes(LinearLayout container) {
        StringBuilder otp = new StringBuilder();

        for (int i = 0; i < container.getChildCount(); i++) {
            EditText box = (EditText) container.getChildAt(i);
            otp.append(box.getText().toString().trim());
        }
        return otp.toString();
    }

    // ================= UI HELPERS =================
    private void setupBottomDialog(Dialog dialog) {
        Window window = dialog.getWindow();
        if (window != null) {
            window.setLayout(
                    WindowManager.LayoutParams.MATCH_PARENT,
                    WindowManager.LayoutParams.WRAP_CONTENT
            );
            window.setBackgroundDrawableResource(android.R.color.transparent);
            window.setGravity(Gravity.BOTTOM);
            window.setWindowAnimations(android.R.style.Animation_Dialog);
        }
    }

    private void animateDialog(View view) {
        view.setTranslationY(300);
        view.setAlpha(0f);
        view.animate()
                .translationY(0)
                .alpha(1f)
                .setDuration(300)
                .setInterpolator(new AccelerateDecelerateInterpolator())
                .start();
    }
    private void shakeView(View view) {
        view.animate()
                .translationX(20).setDuration(50)
                .withEndAction(() ->
                        view.animate().translationX(-20).setDuration(50)
                                .withEndAction(() ->
                                        view.animate().translationX(0).setDuration(50)
                                )
                );
    }

    // ================= TRUECALLER FLOW =================

    private void startTruecallerFlow() {

        if (!TcSdk.getInstance().isOAuthFlowUsable()) {
           // Toast.makeText(this, "Truecaller not available", Toast.LENGTH_SHORT).show();
            return;
        }
        // STATE
        stateRequested = new BigInteger(130, new SecureRandom()).toString(32);
        TcSdk.getInstance().setOAuthState(stateRequested);

        // SCOPES
        TcSdk.getInstance().setOAuthScopes(new String[]{
                "phone",
                "openid"
        });

        // PKCE
        codeVerifier = generateCodeVerifier();
        String codeChallenge = generateCodeChallenge(codeVerifier);

        if (codeChallenge != null) {
            TcSdk.getInstance().setCodeChallenge(codeChallenge);
        } else {
            Toast.makeText(this, "Error initializing TC", Toast.LENGTH_SHORT).show();
            return;
        }

        // START
        TcSdk.getInstance().getAuthorizationCode(this, tcLauncher);
    }

    // ================= TRUECALLER CALLBACK =================

    private TcOAuthCallback tcOAuthCallback = new TcOAuthCallback() {

        @Override
        public void onVerificationRequired(@Nullable TcOAuthError error) {
            Toast.makeText(LoginActivity.this,
                    "Manual verification required",
                    Toast.LENGTH_SHORT).show();

            // fallback
            showPhoneDialog();
        }

        @Override
        public void onSuccess(TcOAuthData data) {
            String authCode = data.getAuthorizationCode();
            String state = data.getState();
            if (!state.equals(stateRequested)) {
                Toast.makeText(LoginActivity.this, "Security error", Toast.LENGTH_SHORT).show();
                return;
            }

            authRepository.loginWithTruecaller(authCode, new AuthCallback() {
                @Override
                public void onSuccess() {
                    runOnUiThread(() -> {
                        Toast.makeText(LoginActivity.this, "Login Success", Toast.LENGTH_SHORT).show();
                        // Navigate
                        startActivity(new Intent(LoginActivity.this, MainActivity.class));
                        finish();
                    });
                }
                @Override
                public void onError(String message) {
                    runOnUiThread(() -> {
                        Toast.makeText(LoginActivity.this, message, Toast.LENGTH_SHORT).show();
                        // fallback to phone login
                        showPhoneDialog();
                    });
                }
            });
        }

        @Override
        public void onFailure(TcOAuthError error) {
            Toast.makeText(LoginActivity.this,
                    "TC Error: " + error.getErrorMessage(),
                    Toast.LENGTH_SHORT).show();
        }
    };

    // ================= PKCE =================

    private String generateCodeVerifier() {
        SecureRandom secureRandom = new SecureRandom();
        byte[] code = new byte[32];
        secureRandom.nextBytes(code);

        return android.util.Base64.encodeToString(code,
                android.util.Base64.URL_SAFE |
                        android.util.Base64.NO_WRAP |
                        android.util.Base64.NO_PADDING);
    }

    private String generateCodeChallenge(String codeVerifier) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] bytes = digest.digest(codeVerifier.getBytes("US-ASCII"));

            return android.util.Base64.encodeToString(bytes,
                    android.util.Base64.URL_SAFE |
                            android.util.Base64.NO_WRAP |
                            android.util.Base64.NO_PADDING);

        } catch (Exception e) {
            return null;
        }
    }

    private void startResendTimer(TextView resendView, long durationMillis) {
        resendView.setEnabled(false);
        new android.os.CountDownTimer(durationMillis, 1000) {
            public void onTick(long millisUntilFinished) {
                long seconds = millisUntilFinished / 1000;
                resendView.setText("Resend in " + seconds + "s");
            }
            public void onFinish() {
                resendView.setText("Resend OTP");
                resendView.setEnabled(true);
            }

        }.start();
    }
}