package in.researchdevs.quickkarigar;

import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import androidx.activity.EdgeToEdge;
import androidx.fragment.app.Fragment;

import in.researchdevs.quickkarigar.ui.home.HomeFragment;
import in.researchdevs.quickkarigar.ui.bookings.BookingsFragment;
import in.researchdevs.quickkarigar.ui.messages.MessagesFragment;
import in.researchdevs.quickkarigar.ui.profile.ProfileFragment;

public class MainActivity extends BaseActivity {

    // NAV ITEMS
    private LinearLayout navHomeContent, navBookingsContent, navMessagesContent, navProfileContent;

    // CURRENT TAB
    private int currentTab = -1; // default = home

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);

        initViews();
        handleInsets();
        selectTab(0);
    }
    private void initViews() {
        navHomeContent = findViewById(R.id.navHome);
        navBookingsContent = findViewById(R.id.navBookings);
        navMessagesContent = findViewById(R.id.navMessages);
        navProfileContent = findViewById(R.id.navProfile);

        // CLICK LISTENERS
        navHomeContent.setOnClickListener(v -> selectTab(0));
        navBookingsContent.setOnClickListener(v -> selectTab(1));
        navMessagesContent.setOnClickListener(v -> selectTab(2));
        navProfileContent.setOnClickListener(v -> selectTab(3));
    }

    private void handleInsets() {
        View root = findViewById(R.id.fragmentContainer);
        // TOP (status bar) → apply padding to content
        root.setOnApplyWindowInsetsListener((v, insets) -> {
            int topInset = insets.getSystemWindowInsetTop();
            v.setPadding(
                    v.getPaddingLeft(),
                    topInset,
                    v.getPaddingRight(),
                    v.getPaddingBottom()
            );
            return insets;
        });
        View bottomNav = findViewById(R.id.bottomNavLayout);
        bottomNav.setOnApplyWindowInsetsListener((v, insets) -> {
            int bottomInset = insets.getSystemWindowInsetBottom();
            ViewGroup.MarginLayoutParams params =
                    (ViewGroup.MarginLayoutParams) v.getLayoutParams();
            params.bottomMargin = bottomInset;
            v.setLayoutParams(params);
            return insets;
        });
    }

    // ================= TAB CONTROL =================
    private void selectTab(int tab) {

        if (currentTab == tab) return; // prevent reload
        currentTab = tab;

        // RESET ALL
        navHomeContent.setSelected(false);
        navBookingsContent.setSelected(false);
        navMessagesContent.setSelected(false);
        navProfileContent.setSelected(false);

        Fragment fragment;

        switch (tab) {
            case 0:
                navHomeContent.setSelected(true);
               fragment = new HomeFragment();
                break;

            case 1:
                navBookingsContent.setSelected(true);
                fragment = new BookingsFragment();
                break;

            case 2:
                navMessagesContent.setSelected(true);
                fragment = new MessagesFragment();
                break;

            case 3:
                navProfileContent.setSelected(true);
                fragment = new ProfileFragment();
                break;

            default:
                return;
        }

        // LOAD FRAGMENT
        getSupportFragmentManager()
                .beginTransaction()
                .replace(R.id.fragmentContainer, fragment)
                .commit();
    }
}