package in.researchdevs.quickkarigar;

import android.app.Dialog;
import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
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
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;

public class LoginActivity extends BaseActivity {

    private GoogleSignInClient mGoogleSignInClient;
    private static final int RC_SIGN_IN = 1001;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_login);


        // Inside your onCreate or a setup method
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .requestIdToken(getString(R.string.default_web_client_id))
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
                Toast.makeText(this, "Google Sign-In Success : " + account.getIdToken(), Toast.LENGTH_SHORT).show();
            } catch (ApiException e) {
                Log.e("G-AUTH", e.toString());
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

        animateDialog(view);

        phoneInput.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {}

            @Override
            public void afterTextChanged(Editable s) {
                if (s.length() > 10) {
                    phoneInput.setText(s.subSequence(0, 10));
                    phoneInput.setSelection(phoneInput.getText().length());
                }
            }
        });

        btnContinue.setOnClickListener(v -> {
            String phone = phoneInput.getText().toString().trim();

            if (phone.length() != 10) {
                phoneInput.setError("Enter valid number");
                return;
            }

            dialog.dismiss();
            showOtpDialog(phone);
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

        btnVerify.setOnClickListener(v -> {
            String otp = getOtpFromBoxes(otpContainer);

            if (otp.length() != 6) {
                Toast.makeText(this, "Enter 6-digit OTP", Toast.LENGTH_SHORT).show();
                shakeView(otpContainer);
                return;
            }

            Toast.makeText(this, "Login Successful", Toast.LENGTH_SHORT).show();
            dialog.dismiss();
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

        animateDialog(view);

        btnContinue.setOnClickListener(v -> {
            String email = emailInput.getText().toString().trim();

            if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                emailInput.setError("Enter valid email");
                return;
            }

            dialog.dismiss();
            showEmailOtpDialog(email);
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

        emailDisplay.setText(email);

        setupOtpInputs(otpContainer);
        animateDialog(view);

        handleOtpButtonState(otpContainer, btnVerify);

        btnVerify.setOnClickListener(v -> {
            String otp = getOtpFromBoxes(otpContainer);

            if (otp.length() != 6) {
                Toast.makeText(this, "Enter 6-digit OTP", Toast.LENGTH_SHORT).show();
                shakeView(otpContainer);
                return;
            }

            Toast.makeText(this, "Email Login Successful", Toast.LENGTH_SHORT).show();
            dialog.dismiss();
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
}