package in.researchdevs.quickkarigar.utility;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;

public class NetworkMonitor {
    public interface NetworkListener {
        void onConnected();
        void onDisconnected();
    }

    private final ConnectivityManager connectivityManager;
    private final NetworkListener listener;
    private ConnectivityManager.NetworkCallback networkCallback;

    public NetworkMonitor(Context context, NetworkListener listener) {
        this.listener = listener;
        connectivityManager = (ConnectivityManager)
                context.getSystemService(Context.CONNECTIVITY_SERVICE);
    }

    public void register() {
        if (connectivityManager == null) return;
        networkCallback = new ConnectivityManager.NetworkCallback() {

            @Override
            public void onAvailable(Network network) {
                if (hasInternet()) {
                    listener.onConnected();
                }
            }
            @Override
            public void onLost(Network network) {
                listener.onDisconnected();
            }
        };
        connectivityManager.registerDefaultNetworkCallback(networkCallback);
    }

    public void unregister() {
        if (connectivityManager != null && networkCallback != null) {
            connectivityManager.unregisterNetworkCallback(networkCallback);
        }
    }

    // Extra check (important for real internet)
    private boolean hasInternet() {
        Network network = connectivityManager.getActiveNetwork();
        if (network == null) return false;

        NetworkCapabilities capabilities =
                connectivityManager.getNetworkCapabilities(network);

        return capabilities != null &&
                capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET);
    }
}