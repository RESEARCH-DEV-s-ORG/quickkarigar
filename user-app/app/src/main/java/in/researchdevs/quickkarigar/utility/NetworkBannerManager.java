package in.researchdevs.quickkarigar.utility;

import android.app.Activity;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.TextView;

import in.researchdevs.quickkarigar.R;

public class NetworkBannerManager {

    private static View bannerView;
    private static boolean isShowing = false;

    public static void attach(Activity activity) {
        if (bannerView != null) return;

        ViewGroup root = activity.findViewById(android.R.id.content);

        bannerView = LayoutInflater.from(activity)
                .inflate(R.layout.view_network_banner, root, false);

        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        params.gravity = Gravity.TOP;

        bannerView.setTranslationY(-200);
        root.addView(bannerView, params);
    }

    public static void showOffline() {
        if (bannerView == null || isShowing) return;

        TextView text = bannerView.findViewById(R.id.bannerText);
        text.setText("No Internet Connection");

        bannerView.setBackgroundColor(0xFFD32F2F);
        bannerView.setVisibility(View.VISIBLE);

        bannerView.animate()
                .translationY(0)
                .setDuration(300)
                .start();

        isShowing = true;
    }

    public static void showOnline() {
        if (bannerView == null) return;

        TextView text = bannerView.findViewById(R.id.bannerText);
        text.setText("Back Online");

        bannerView.setBackgroundColor(0xFF388E3C);

        bannerView.postDelayed(() -> {
            bannerView.animate()
                    .translationY(-bannerView.getHeight())
                    .setDuration(300)
                    .withEndAction(() -> bannerView.setVisibility(View.GONE))
                    .start();

            isShowing = false;
        }, 1000);
    }
}