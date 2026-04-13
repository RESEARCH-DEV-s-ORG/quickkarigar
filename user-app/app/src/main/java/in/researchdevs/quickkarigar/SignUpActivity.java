package in.researchdevs.quickkarigar;

import android.content.Intent;
import android.graphics.Color;
import android.graphics.Typeface;
import android.os.Bundle;
import android.text.InputType;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.TextPaint;
import android.text.method.LinkMovementMethod;
import android.text.style.ClickableSpan;
import android.text.style.ForegroundColorSpan;
import android.text.style.StyleSpan;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;

import in.researchdevs.quickkarigar.utility.PressableClickableSpan;


public class SignUpActivity extends BaseActivity {

    private GoogleSignInClient mGoogleSignInClient;
    private static final int RC_SIGN_IN = 1001;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_sign_up);

        TextView textView = findViewById(R.id.termsText);
        String text = "I agree to the Terms of Service and Privacy Policy";

        SpannableString spannable = new SpannableString(text);


        // Terms Click
        PressableClickableSpan termsClick = new PressableClickableSpan(
                getResources().getColor(R.color.primary),
                Color.GRAY
        ) {
            @Override
            public void onClick(View widget) {
                Intent intent = new Intent(widget.getContext(), WebViewActivity.class);
                intent.putExtra("url", "https://research-dev-s-org.github.io/quickkarigar/user-terms/");
                intent.putExtra("title", "Terms of Service");
                widget.getContext().startActivity(intent);
            }
        };

        // Privacy Click
        PressableClickableSpan privacyClick = new PressableClickableSpan(
                getResources().getColor(R.color.primary),
                Color.GRAY
        ) {
            @Override
            public void onClick(View widget) {
                Intent intent = new Intent(widget.getContext(), WebViewActivity.class);
                intent.putExtra("url", "https://research-dev-s-org.github.io/quickkarigar/user-privacy/");
                intent.putExtra("title", "Privacy Policy");
                widget.getContext().startActivity(intent);
            }
        };

        // Apply spans (IMPORTANT indexes)
        spannable.setSpan(termsClick, 15, 31, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        spannable.setSpan(privacyClick, 36, 50, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        // Styling
        spannable.setSpan(new StyleSpan(Typeface.BOLD), 15, 31, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        spannable.setSpan(new ForegroundColorSpan(getResources().getColor(R.color.primary)), 15, 31, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        spannable.setSpan(new StyleSpan(Typeface.BOLD), 36, 50, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        spannable.setSpan(new ForegroundColorSpan(getResources().getColor(R.color.primary)), 36, 50, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        // Set text
        textView.setText(spannable);
        textView.setMovementMethod(LinkMovementMethod.getInstance());
        textView.setHighlightColor(Color.TRANSPARENT);


        findViewById(R.id.loginActivityBtn).setOnClickListener(v -> {
            Intent intent = new Intent(SignUpActivity.this, LoginActivity.class);
            startActivity(intent);

            overridePendingTransition(
                    android.R.anim.fade_in,
                    0
            );
        });

        EditText passwordInput = findViewById(R.id.passwordInput);
        ImageView toggle = findViewById(R.id.togglePassword);

        toggle.setOnClickListener(v -> {
            if (passwordInput.getInputType() == (InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD)) {
                passwordInput.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD);
                toggle.setImageResource(R.drawable.ic_eye_off);
            } else {
                passwordInput.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
                toggle.setImageResource(R.drawable.ic_eye);
            }
            passwordInput.setSelection(passwordInput.getText().length());
        });


        // Inside your onCreate or a setup method
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .requestIdToken(getString(R.string.default_web_client_id))
                .build();
        mGoogleSignInClient = GoogleSignIn.getClient(this, gso);

        findViewById(R.id.googleSignUpButton).setOnClickListener(v -> signUpWithGoogle());
    }

    private void signUpWithGoogle() {
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
                Toast.makeText(this, "Google Sign-In Failed: " + e.getStatusCode(), Toast.LENGTH_LONG).show();
            }
        }
    }
}