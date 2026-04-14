package in.researchdevs.quickkarigar;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;

import in.researchdevs.quickkarigar.data.local.SessionManager;

public class MainActivity extends BaseActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);

        findViewById(R.id.logout).setOnClickListener(v -> {
            SessionManager sessionManager = new SessionManager(v.getContext());
            sessionManager.logout();
            Toast.makeText(MainActivity.this, "Login Out", Toast.LENGTH_SHORT).show();
            startActivity(new Intent(MainActivity.this, LoginActivity.class));
            finish();
        });
    }
}