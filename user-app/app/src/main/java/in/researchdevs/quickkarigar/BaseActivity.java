package in.researchdevs.quickkarigar;


import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import in.researchdevs.quickkarigar.utility.NetworkBannerManager;
import in.researchdevs.quickkarigar.utility.NetworkMonitor;

public class BaseActivity extends AppCompatActivity {
    private NetworkMonitor networkMonitor;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Inject banner dynamically into root view
        getWindow().getDecorView().post(() -> {
            NetworkBannerManager.attach(this);
        });
    }

    @Override
    protected void onStart() {
        super.onStart();
        // Start listening network changes
        networkMonitor = new NetworkMonitor(this, new NetworkMonitor.NetworkListener() {
            @Override
            public void onConnected() {
                runOnUiThread(() -> NetworkBannerManager.showOnline());
            }
            @Override
            public void onDisconnected() {
                runOnUiThread(() -> NetworkBannerManager.showOffline());
            }
        });
        networkMonitor.register();
    }

    @Override
    protected void onStop() {
        super.onStop();
        // Stop listener to prevent memory leaks
        if (networkMonitor != null) {
            networkMonitor.unregister();
        }
    }
}