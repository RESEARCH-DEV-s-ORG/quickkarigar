package in.researchdevs.quickkarigar;

import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Typeface;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.text.*;
import android.text.method.LinkMovementMethod;
import android.text.style.ForegroundColorSpan;
import android.text.style.StyleSpan;
import android.util.Patterns;
import android.view.*;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.widget.*;

import androidx.activity.EdgeToEdge;

import com.google.android.gms.auth.api.signin.*;
import com.google.android.gms.common.api.ApiException;

import in.researchdevs.quickkarigar.data.repository.AuthCallback;
import in.researchdevs.quickkarigar.data.repository.AuthRepository;
import in.researchdevs.quickkarigar.utility.PressableClickableSpan;

public class SignUpActivity extends BaseActivity {

    private GoogleSignInClient mGoogleSignInClient;
    private static final int RC_SIGN_IN = 1001;
    private AuthRepository authRepository;
    private EditText nameInput, emailInput, phoneInput;
    private CheckBox termsCheckbox;
    private View btnSignUp;
    private TextView btnText;
    private View btnLoader;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_sign_up);

        View root = findViewById(R.id.signup_screen);
        root.setOnApplyWindowInsetsListener((v, insets) -> {
            int top = insets.getSystemWindowInsetTop();
            int bottom = insets.getSystemWindowInsetBottom();

            v.setPadding(0, top, 0, bottom);
            return insets;
        });

        authRepository = new AuthRepository(this);

        initViews();
        setupValidation();
        setupClickListeners();
        setupGoogle();
        setupTermsText();


        findViewById(R.id.privacyPolicyBtn).setOnClickListener(v -> {
            openWebPage(v.getContext(), v.getContext().getString(R.string.user_privacy_url), "Privacy Policy");
        });

        findViewById(R.id.termsBtn).setOnClickListener(v -> {
            openWebPage(v.getContext(), v.getContext().getString(R.string.user_terms_url), "Terms of Service");
        });

        findViewById(R.id.contactSupportBtn).setOnClickListener(v -> {
            openWebPage(v.getContext(), v.getContext().getString(R.string.contact_url), "Contact Support");
        });
    }

    private void initViews() {
        nameInput = findViewById(R.id.nameInput);
        emailInput = findViewById(R.id.emailIdInput);
        phoneInput = findViewById(R.id.phoneNoInput);
        termsCheckbox = findViewById(R.id.termsCheckbox);

        btnSignUp = findViewById(R.id.btnSignUp);
        btnText = findViewById(R.id.btnText);
        btnLoader = findViewById(R.id.btnLoaderCreate);
    }

    // ================= VALIDATION =================
    private void setupValidation() {
        TextWatcher watcher = new SimpleTextWatcher(this::validateForm);

        nameInput.addTextChangedListener(watcher);
        emailInput.addTextChangedListener(watcher);
        phoneInput.addTextChangedListener(watcher);

        termsCheckbox.setOnCheckedChangeListener((b, c) -> validateForm());
    }

    private void validateForm() {
        String email = emailInput.getText().toString();

        boolean emailValid = email.isEmpty() || Patterns.EMAIL_ADDRESS.matcher(email).matches();

        boolean valid =
                !nameInput.getText().toString().trim().isEmpty() &&
                        emailValid &&
                        phoneInput.getText().toString().length() == 10 &&
                        termsCheckbox.isChecked();

        btnSignUp.setEnabled(valid);
        btnSignUp.setAlpha(valid ? 1f : 0.5f);
    }

    // ================= CLICK =================
    private void setupClickListeners() {

        btnSignUp.setOnClickListener(v -> {

            String name = nameInput.getText().toString().trim();
            String email = emailInput.getText().toString().trim();
            String phone = phoneInput.getText().toString().trim();

            setLoading(true);

            authRepository.signUp(name, email, phone, new AuthCallback() {
                @Override
                public void onSuccess() {
                    setLoading(false);
                    showOtpLayout(phone, email);
                }

                @Override
                public void onError(String message) {
                    setLoading(false);
                    Toast.makeText(SignUpActivity.this, message, Toast.LENGTH_SHORT).show();
                }
            });
        });

        findViewById(R.id.loginActivityBtn).setOnClickListener(v -> {
            startActivity(new Intent(this, LoginActivity.class));
            finish();
            overridePendingTransition(
                    android.R.anim.fade_in,
                    0
            );
        });
    }

    // ================= OTP =================
    private void showOtpLayout(String phone, String email) {

        Dialog dialog = new Dialog(this, R.style.BottomDialogTheme);
        View view = LayoutInflater.from(this).inflate(R.layout.layout_otp_verification, null);
        dialog.setContentView(view);

        setupBottomDialog(dialog);

        LinearLayout phoneOtp = view.findViewById(R.id.phoneOtpContainer);
        LinearLayout emailOtp = view.findViewById(R.id.emailOtpContainer);
        TextView phoneDisplay = view.findViewById(R.id.phoneDisplay);
        TextView emailDisplay = view.findViewById(R.id.emailDisplay);
        TextView emailLabel = view.findViewById(R.id.emailLabel);
        TextView resendPhone = view.findViewById(R.id.resendPhoneOtp);
        TextView resendEmail = view.findViewById(R.id.resendEmailOtp);

        Button btnVerify = view.findViewById(R.id.btnVerify);
        ProgressBar loader = view.findViewById(R.id.btnLoader);

        phoneDisplay.setText("+91 " + phone);

        boolean hasEmail = email != null && !email.isEmpty();

        setupOtpInputs(phoneOtp);
        startResendTimer(resendPhone);

        resendPhone.setOnClickListener(v -> {
            authRepository.requestPhoneOtp(phone, new AuthCallback() {
                @Override
                public void onSuccess() {
                    Toast.makeText(SignUpActivity.this, "Phone OTP Resent", Toast.LENGTH_SHORT).show();
                    // restart timer
                    startResendTimer(resendPhone);
                }
                @Override
                public void onError(String message) {
                    Toast.makeText(SignUpActivity.this, message, Toast.LENGTH_SHORT).show();
                }
            });
        });

        if (hasEmail) {
            emailLabel.setVisibility(View.VISIBLE);
            emailDisplay.setVisibility(View.VISIBLE);
            emailOtp.setVisibility(View.VISIBLE);
            resendEmail.setVisibility(View.VISIBLE);

            emailDisplay.setText(email);
            setupOtpInputs(emailOtp);
            startResendTimer(resendEmail);


            resendEmail.setOnClickListener(v -> {
                authRepository.requestEmailOtp(email, new AuthCallback() {
                    @Override
                    public void onSuccess() {
                        Toast.makeText(SignUpActivity.this, "Email OTP Resent", Toast.LENGTH_SHORT).show();
                        // restart timer
                        startResendTimer(resendEmail);
                    }
                    @Override
                    public void onError(String message) {
                        Toast.makeText(SignUpActivity.this, message, Toast.LENGTH_SHORT).show();
                    }
                });
            });
        }

        handleOtpButtonState(phoneOtp, emailOtp, hasEmail, btnVerify);

        btnVerify.setOnClickListener(v -> {

            String phoneOtpVal = getOtp(phoneOtp);
            String emailOtpVal = hasEmail ? getOtp(emailOtp) : null;

            if (phoneOtpVal.length() != 6) {
                shakeView(phoneOtp);
                return;
            }

            if (hasEmail && emailOtpVal.length() != 6) {
                shakeView(emailOtp);
                return;
            }

            loader.setVisibility(View.VISIBLE);
            btnVerify.setText("");
            btnVerify.setEnabled(false);

            authRepository.verifySignupOtp(phone, phoneOtpVal, email, emailOtpVal, new AuthCallback() {
                @Override
                public void onSuccess() {
                    dialog.dismiss();
                    startActivity(new Intent(SignUpActivity.this, MainActivity.class));
                    finish();
                }

                @Override
                public void onError(String message) {
                    loader.setVisibility(View.GONE);
                    btnVerify.setText("Verify");
                    btnVerify.setEnabled(true);

                    Toast.makeText(SignUpActivity.this, message, Toast.LENGTH_SHORT).show();

                    if (message.toLowerCase().contains("email")) {
                        shakeView(emailOtp);
                    } else {
                        shakeView(phoneOtp);
                    }
                }
            });
        });

        animateDialog(view);
        dialog.show();
    }

    // ================= OTP INPUT =================
    private void setupOtpInputs(LinearLayout container) {

        for (int i = 0; i < container.getChildCount(); i++) {

            EditText box = (EditText) container.getChildAt(i);
            int index = i;

            box.addTextChangedListener(new SimpleTextWatcher(() -> {
                if (box.getText().length() == 1 && index < container.getChildCount() - 1) {
                    container.getChildAt(index + 1).requestFocus();
                }
            }));

            box.setOnKeyListener((v, keyCode, event) -> {
                if (keyCode == KeyEvent.KEYCODE_DEL && event.getAction() == KeyEvent.ACTION_DOWN) {

                    if (box.getText().toString().isEmpty() && index > 0) {
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

    private void handleOtpButtonState(LinearLayout phoneOtp, LinearLayout emailOtp, boolean hasEmail, Button btn) {

        btn.setEnabled(false);
        btn.setAlpha(0.5f);

        TextWatcher watcher = new SimpleTextWatcher(() -> {

            boolean phoneDone = getOtp(phoneOtp).length() == 6;
            boolean emailDone = !hasEmail || getOtp(emailOtp).length() == 6;

            if (phoneDone && emailDone) {
                btn.setEnabled(true);
                btn.setAlpha(1f);
            } else {
                btn.setEnabled(false);
                btn.setAlpha(0.5f);
            }
        });

        for (int i = 0; i < phoneOtp.getChildCount(); i++)
            ((EditText) phoneOtp.getChildAt(i)).addTextChangedListener(watcher);

        if (hasEmail) {
            for (int i = 0; i < emailOtp.getChildCount(); i++)
                ((EditText) emailOtp.getChildAt(i)).addTextChangedListener(watcher);
        }
    }

    private String getOtp(LinearLayout container) {
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < container.getChildCount(); i++) {
            otp.append(((EditText) container.getChildAt(i)).getText().toString());
        }
        return otp.toString();
    }

    private void shakeView(View view) {
        view.animate().translationX(20).setDuration(50)
                .withEndAction(() ->
                        view.animate().translationX(-20).setDuration(50)
                                .withEndAction(() ->
                                        view.animate().translationX(0).setDuration(50)
                                )
                );
    }

    private void startResendTimer(TextView view) {
        view.setEnabled(false);
        new CountDownTimer(60000, 1000) {
            public void onTick(long millisUntilFinished) {
                view.setText("Resend in " + millisUntilFinished / 1000 + "s");
            }
            public void onFinish() {
                view.setEnabled(true);

                if (view.getId() == R.id.resendPhoneOtp) {
                    view.setText("Resend Phone OTP");
                } else {
                    view.setText("Resend Email OTP");
                }
            }
        }.start();
    }
    // ================= UI =================
    private void setupBottomDialog(Dialog dialog) {
        Window window = dialog.getWindow();
        if (window != null) {
            window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT);
            window.setGravity(Gravity.BOTTOM);
        }
    }

    private void animateDialog(View view) {
        view.setTranslationY(300);
        view.animate().translationY(0).setDuration(300)
                .setInterpolator(new AccelerateDecelerateInterpolator()).start();
    }

    private void setLoading(boolean loading) {
        btnLoader.setVisibility(loading ? View.VISIBLE : View.GONE);
        btnText.setVisibility(loading ? View.INVISIBLE : View.VISIBLE);
    }

    // ================= GOOGLE =================
    private void setupGoogle() {
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .requestIdToken(getString(R.string.google_web_client_id))
                .build();

        mGoogleSignInClient = GoogleSignIn.getClient(this, gso);

        findViewById(R.id.googleSignUpButton).setOnClickListener(v ->
                startActivityForResult(mGoogleSignInClient.getSignInIntent(), RC_SIGN_IN));
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == RC_SIGN_IN) {
            try {
                GoogleSignInAccount account = GoogleSignIn
                        .getSignedInAccountFromIntent(data)
                        .getResult(ApiException.class);
                authRepository.loginWithGoogle(account.getIdToken(), new AuthCallback() {
                    @Override public void onSuccess() {
                        startActivity(new Intent(SignUpActivity.this, MainActivity.class));
                        finish();
                    }
                    @Override public void onError(String message) {
                        Toast.makeText(SignUpActivity.this, message, Toast.LENGTH_SHORT).show();
                    }
                });
            } catch (ApiException e) {
                Toast.makeText(this, "Google Failed", Toast.LENGTH_SHORT).show();
            }
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    // ================= HELPER =================
    private static class SimpleTextWatcher implements TextWatcher {
        Runnable after;
        SimpleTextWatcher(Runnable after) { this.after = after; }
        public void beforeTextChanged(CharSequence s, int st, int c, int a) {}
        public void onTextChanged(CharSequence s, int st, int b, int c) {}
        public void afterTextChanged(Editable s) { after.run(); }
    }

    private void setupTermsText() {
        TextView textView = findViewById(R.id.termsText);
        String text = "I agree to the Terms of Service and Privacy Policy";

        SpannableString spannable = new SpannableString(text);

        PressableClickableSpan termsClick = new PressableClickableSpan(getColor(R.color.primary), Color.GRAY) {
            @Override
            public void onClick(View widget) {
                openWebPage(widget.getContext(), getString(R.string.user_terms_url), "Terms of Service");
            }
        };

        PressableClickableSpan privacyClick = new PressableClickableSpan(getColor(R.color.primary), Color.GRAY) {
            @Override
            public void onClick(View widget) {
                openWebPage(widget.getContext(), getString(R.string.user_privacy_url), "Privacy Policy");
            }
        };

        spannable.setSpan(termsClick, 15, 31, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        spannable.setSpan(privacyClick, 36, 50, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);

        spannable.setSpan(new StyleSpan(Typeface.BOLD), 15, 31, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        spannable.setSpan(new ForegroundColorSpan(getColor(R.color.primary)), 15, 31, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);

        spannable.setSpan(new StyleSpan(Typeface.BOLD), 36, 50, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        spannable.setSpan(new ForegroundColorSpan(getColor(R.color.primary)), 36, 50, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);

        textView.setText(spannable);
        textView.setMovementMethod(LinkMovementMethod.getInstance());
        textView.setHighlightColor(Color.TRANSPARENT);
    }

    public void openWebPage(Context c, String url, String title) {
        Intent i = new Intent(c, WebViewActivity.class);
        i.putExtra("url", url);
        i.putExtra("title", title);
        c.startActivity(i);
    }
}