package in.researchdevs.quickkarigar;

import android.animation.ObjectAnimator;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.widget.ProgressBar;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;

public class SplashActivity extends AppCompatActivity {

    private ProgressBar progressBar;
    private CardView logoCard;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_splash);

        progressBar = findViewById(R.id.progressBar);
        logoCard = findViewById(R.id.logoCard);

        // 🔥 Logo Animation (scale + fade)
        logoCard.setScaleX(0.7f);
        logoCard.setScaleY(0.7f);
        logoCard.setAlpha(0f);

        logoCard.animate()
                .scaleX(1f)
                .scaleY(1f)
                .alpha(1f)
                .setDuration(1000)
                .setInterpolator(new AccelerateDecelerateInterpolator())
                .start();

        // 🔥 Progress Animation (0 → 100)
        ObjectAnimator progressAnimator = ObjectAnimator.ofInt(progressBar, "progress", 0, 100);
        progressAnimator.setDuration(2200);
        progressAnimator.setInterpolator(new AccelerateDecelerateInterpolator());
        progressAnimator.start();

        // 🔥 Move to MainActivity after animation
        new Handler().postDelayed(() -> {
            startActivity(new Intent(SplashActivity.this, MainActivity.class));
            overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out);
            finish();
        }, 2500); // matches animation
    }
}