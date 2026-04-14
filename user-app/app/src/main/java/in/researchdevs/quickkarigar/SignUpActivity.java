package in.researchdevs.quickkarigar;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Typeface;
import android.os.Bundle;
import android.text.Editable;
import android.text.InputType;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.TextWatcher;
import android.text.method.LinkMovementMethod;
import android.text.style.ForegroundColorSpan;
import android.text.style.StyleSpan;
import android.util.Patterns;
import android.view.View;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;

import com.google.android.gms.auth.api.signin.*;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;

import in.researchdevs.quickkarigar.data.repository.AuthCallback;
import in.researchdevs.quickkarigar.data.repository.AuthRepository;
import in.researchdevs.quickkarigar.utility.PressableClickableSpan;

public class SignUpActivity extends BaseActivity {

    private GoogleSignInClient mGoogleSignInClient;
    private static final int RC_SIGN_IN = 1001;

    private AuthRepository authRepository;

    // UI
    private EditText nameInput, emailInput, phoneInput, passwordInput;
    private CheckBox termsCheckbox;
    private View btnSignUp;
    private TextView btnText;
    private View btnLoader;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_sign_up);

        authRepository = new AuthRepository(this);

        initViews();
        setupValidation();
        setupClickListeners();
        setupGoogle();
        setupTermsText();
    }

    // ================= INIT =================
    private void initViews() {
        nameInput = findViewById(R.id.nameInput);
        emailInput = findViewById(R.id.emailIdInput);
        phoneInput = findViewById(R.id.phoneNoInput);
        passwordInput = findViewById(R.id.passwordInput);
        termsCheckbox = findViewById(R.id.termsCheckbox);

        btnSignUp = findViewById(R.id.btnSignUp);
        btnText = findViewById(R.id.btnText);
        btnLoader = findViewById(R.id.btnLoaderCreate);

        ImageView toggle = findViewById(R.id.togglePassword);

        toggle.setOnClickListener(v -> togglePassword());
    }

    // ================= VALIDATION =================
    private void setupValidation() {

        TextWatcher watcher = new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {}

            @Override
            public void afterTextChanged(Editable s) {
                validateForm();
            }
        };

        nameInput.addTextChangedListener(watcher);
        emailInput.addTextChangedListener(watcher);
        phoneInput.addTextChangedListener(watcher);
        passwordInput.addTextChangedListener(watcher);

        termsCheckbox.setOnCheckedChangeListener((b, c) -> validateForm());
    }

    private void validateForm() {
        boolean valid =
                !nameInput.getText().toString().trim().isEmpty() &&
                        Patterns.EMAIL_ADDRESS.matcher(emailInput.getText().toString()).matches() &&
                        phoneInput.getText().toString().length() == 10 &&
                        passwordInput.getText().toString().length() >= 6 &&
                        termsCheckbox.isChecked();

        btnSignUp.setEnabled(valid);
        btnSignUp.setAlpha(valid ? 1f : 0.5f);
    }

    // ================= CLICK =================
    private void setupClickListeners() {

        btnSignUp.setOnClickListener(v -> {

            if (!btnSignUp.isEnabled()) return;

            String name = nameInput.getText().toString().trim();
            String email = emailInput.getText().toString().trim();
            String phone = phoneInput.getText().toString().trim();
            String password = passwordInput.getText().toString().trim();

            // Validation (extra safety)
            if (name.isEmpty()) {
                nameInput.setError("Enter full name");
                nameInput.requestFocus();
                return;
            }

            if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                emailInput.setError("Enter valid email");
                emailInput.requestFocus();
                return;
            }

            if (phone.length() != 10) {
                phoneInput.setError("Enter valid number");
                phoneInput.requestFocus();
                return;
            }

            if (password.length() < 6) {
                passwordInput.setError("Min 6 characters required");
                passwordInput.requestFocus();
                return;
            }

            if (!termsCheckbox.isChecked()) {
                Toast.makeText(this, "Accept Terms & Privacy Policy", Toast.LENGTH_SHORT).show();
                return;
            }

            // LOADING
            setLoading(true);

            authRepository.signUp(name, email, phone, password, new AuthCallback() {

                @Override
                public void onSuccess() {
                    setLoading(false);

                    Toast.makeText(SignUpActivity.this, "Account Created", Toast.LENGTH_SHORT).show();

                    startActivity(new Intent(SignUpActivity.this, MainActivity.class));
                    finish();
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
            overridePendingTransition(android.R.anim.fade_in, 0);
        });

        findViewById(R.id.contactSupportBtn).setOnClickListener(v -> {
            openWebPage(this, getString(R.string.contact_url), "Contact Support");
        });

        findViewById(R.id.privacyPolicyBtn).setOnClickListener(v -> {
            openWebPage(this, getString(R.string.user_privacy_url), "Privacy Policy");
        });

        findViewById(R.id.termsBtn).setOnClickListener(v -> {
            openWebPage(this, getString(R.string.user_terms_url), "Terms of Service");
        });
    }

    // ================= LOADING =================
    private void setLoading(boolean isLoading) {

        if (isLoading) {
            btnText.animate().alpha(0f).setDuration(150)
                    .withEndAction(() -> btnText.setVisibility(View.INVISIBLE));

            btnLoader.setScaleX(0.7f);
            btnLoader.setScaleY(0.7f);
            btnLoader.setAlpha(0f);
            btnLoader.setVisibility(View.VISIBLE);

            btnLoader.animate().alpha(1f).scaleX(1f).scaleY(1f).setDuration(200).start();

            btnSignUp.setEnabled(false);
            btnSignUp.setAlpha(0.7f);

        } else {
            btnLoader.animate().alpha(0f).scaleX(0.7f).scaleY(0.7f)
                    .setDuration(150)
                    .withEndAction(() -> btnLoader.setVisibility(View.GONE));

            btnText.setAlpha(0f);
            btnText.setVisibility(View.VISIBLE);
            btnText.animate().alpha(1f).setDuration(200).start();

            btnSignUp.setEnabled(true);
            btnSignUp.setAlpha(1f);
        }
    }

    // ================= PASSWORD =================
    private void togglePassword() {
        if (passwordInput.getInputType() ==
                (InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD)) {

            passwordInput.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD);

        } else {
            passwordInput.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
        }
        passwordInput.setSelection(passwordInput.getText().length());
    }

    // ================= GOOGLE =================
    private void setupGoogle() {
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .requestIdToken(getString(R.string.google_web_client_id))
                .build();

        mGoogleSignInClient = GoogleSignIn.getClient(this, gso);

        findViewById(R.id.googleSignUpButton).setOnClickListener(v -> {
            mGoogleSignInClient.signOut();
            startActivityForResult(mGoogleSignInClient.getSignInIntent(), RC_SIGN_IN);
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == RC_SIGN_IN) {
            try {
                GoogleSignInAccount account = GoogleSignIn
                        .getSignedInAccountFromIntent(data)
                        .getResult(ApiException.class);

                authRepository.loginWithGoogle(account.getIdToken(), new AuthCallback() {
                    @Override
                    public void onSuccess() {
                        Toast.makeText(SignUpActivity.this, "Login Success", Toast.LENGTH_SHORT).show();
                        startActivity(new Intent(SignUpActivity.this, MainActivity.class));
                        finish();
                    }

                    @Override
                    public void onError(String message) {
                        Toast.makeText(SignUpActivity.this, message, Toast.LENGTH_SHORT).show();
                    }
                });

            } catch (ApiException e) {
                Toast.makeText(this, "Google Sign-In Failed", Toast.LENGTH_SHORT).show();
            }
        }
    }

    // ================= TERMS =================
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
    // ================= WEB =================
    public void openWebPage(Context context, String url, String title) {
        Intent intent = new Intent(context, WebViewActivity.class);
        intent.putExtra("url", url);
        intent.putExtra("title", title);
        context.startActivity(intent);
    }
}