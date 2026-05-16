package in.researchdevs.quickkarigar.ui.quotation;

import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.DecelerateInterpolator;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.google.android.material.textfield.TextInputEditText;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;

import in.researchdevs.quickkarigar.R;
import in.researchdevs.quickkarigar.adapter.ServiceTypeAdapter;
import in.researchdevs.quickkarigar.model.Artisan;
import in.researchdevs.quickkarigar.model.ServiceType;

public class RequestQuotationFragment extends Fragment {

    // ════════════════════════════════════════════════════════════════════════
    // ARGUMENT KEYS
    // ════════════════════════════════════════════════════════════════════════

    private static final String ARG_NAME        = "artisan_name";
    private static final String ARG_SERVICE     = "artisan_service";
    private static final String ARG_RATING      = "artisan_rating";
    private static final String ARG_DISTANCE    = "artisan_distance";
    private static final String ARG_IMAGE_URL   = "artisan_image_url";
    private static final String ARG_IS_ONLINE   = "artisan_is_online";

    // ════════════════════════════════════════════════════════════════════════
    // TIME SLOT DATA
    // ════════════════════════════════════════════════════════════════════════

    private static final String[] TIME_SLOTS = {
            "10:30 AM",
            "07:30 PM",
            "02:00 PM",
            "06:00 PM"
    };

    private static final boolean[] FAST_FILLING = {
            true,
            false,
            false,
            false
    };

    // ════════════════════════════════════════════════════════════════════════
    // SELECTED STATES
    // ════════════════════════════════════════════════════════════════════════

    private int selectedDateIndex = 2;
    private int selectedSlotIndex = 0;

    // ════════════════════════════════════════════════════════════════════════
    // VIEWS
    // ════════════════════════════════════════════════════════════════════════

    private ImageView ivAvatar;

    private TextView tvName;
    private TextView tvService;
    private TextView tvRating;
    private TextView tvDistance;
    private TextView tvReviews;
    private TextView tvMonthYear;
    private TextView tvPrice;

    private RecyclerView rvDates;
    private RecyclerView rvServiceTypes;

    private LinearLayout slot1;
    private LinearLayout slot2;
    private LinearLayout slot3;
    private LinearLayout slot4;

    private LinearLayout[] slotViews;

    private TextInputEditText etNotes;

    private LinearLayout btnRequestQuote;

    // Adapter
    private ServiceTypeAdapter serviceTypeAdapter;

    // ════════════════════════════════════════════════════════════════════════
    // FACTORY
    // ════════════════════════════════════════════════════════════════════════

    public static RequestQuotationFragment newInstance(Artisan artisan) {

        RequestQuotationFragment fragment = new RequestQuotationFragment();

        Bundle args = new Bundle();

        args.putString(ARG_NAME, artisan.name);
        args.putString(ARG_SERVICE, artisan.service);
        args.putFloat(ARG_RATING, artisan.rating);
        args.putString(ARG_DISTANCE, artisan.distance);
        args.putString(ARG_IMAGE_URL, artisan.imageUrl);
        args.putBoolean(ARG_IS_ONLINE, artisan.isOnline);

        fragment.setArguments(args);

        return fragment;
    }

    // ════════════════════════════════════════════════════════════════════════
    // LIFECYCLE
    // ════════════════════════════════════════════════════════════════════════

    @Nullable
    @Override
    public View onCreateView(
            @NonNull LayoutInflater inflater,
            @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState
    ) {

        return inflater.inflate(
                R.layout.fragment_request_quotation,
                container,
                false
        );
    }

    @Override
    public void onViewCreated(
            @NonNull View view,
            @Nullable Bundle savedInstanceState
    ) {

        super.onViewCreated(view, savedInstanceState);

        bindViews(view);

        populateArtisanCard();

        setupDateStrip();

        setupTimeSlots();

        setupServiceTypes();

        setupListeners(view);

        animateIn(view);
    }

    // ════════════════════════════════════════════════════════════════════════
    // BIND VIEWS
    // ════════════════════════════════════════════════════════════════════════

    private void bindViews(View root) {

        ivAvatar = root.findViewById(R.id.ivArtisanAvatar);

        tvName = root.findViewById(R.id.tvArtisanName);
        tvService = root.findViewById(R.id.tvServiceDescription);
        tvRating = root.findViewById(R.id.tvRating);
        tvDistance = root.findViewById(R.id.tvDistance);
        tvReviews = root.findViewById(R.id.tvReviews);
        tvMonthYear = root.findViewById(R.id.tvMonthYear);
        tvPrice = root.findViewById(R.id.tvPrice);

        rvDates = root.findViewById(R.id.rvDates);
        rvServiceTypes = root.findViewById(R.id.rvServiceTypes);

        slot1 = root.findViewById(R.id.slot1);
        slot2 = root.findViewById(R.id.slot2);
        slot3 = root.findViewById(R.id.slot3);
        slot4 = root.findViewById(R.id.slot4);

        slotViews = new LinearLayout[]{
                slot1,
                slot2,
                slot3,
                slot4
        };

        etNotes = root.findViewById(R.id.etArtisanNotes);

        btnRequestQuote = root.findViewById(R.id.btnRequestQuote);
    }

    // ════════════════════════════════════════════════════════════════════════
    // ARTISAN CARD
    // ════════════════════════════════════════════════════════════════════════

    private void populateArtisanCard() {

        Bundle args = getArguments();

        if (args == null) return;

        String name = args.getString(ARG_NAME, "");
        String service = args.getString(ARG_SERVICE, "");
        float rating = args.getFloat(ARG_RATING, 0f);
        String distance = args.getString(ARG_DISTANCE, "");
        String imageUrl = args.getString(ARG_IMAGE_URL, "");
        boolean isOnline = args.getBoolean(ARG_IS_ONLINE, false);

        tvName.setText(name);

        tvService.setText(
                "Expert " + service + " · Specialist"
        );

        tvRating.setText(String.valueOf(rating));

        tvDistance.setText(distance + " km");

        tvReviews.setText("648 Reviews");

        View onlineDot = requireView().findViewById(R.id.ivOnlineDot);

        if (onlineDot != null) {

            onlineDot.setVisibility(
                    isOnline ? View.VISIBLE : View.GONE
            );
        }

        Glide.with(this)
                .load(imageUrl)
                .placeholder(R.drawable.ic_user)
                .error(R.drawable.ic_user)
                .centerCrop()
                .into(ivAvatar);
    }

    // ════════════════════════════════════════════════════════════════════════
    // DATE STRIP
    // ════════════════════════════════════════════════════════════════════════

    private void setupDateStrip() {

        Calendar calendar = Calendar.getInstance();

        List<DateItem> dates = new ArrayList<>();

        for (int i = 0; i < 14; i++) {

            Calendar c = (Calendar) calendar.clone();

            c.add(Calendar.DAY_OF_MONTH, i);

            String day = new SimpleDateFormat(
                    "EEE",
                    Locale.getDefault()
            ).format(c.getTime());

            String date = String.valueOf(
                    c.get(Calendar.DAY_OF_MONTH)
            );

            dates.add(new DateItem(day, date));
        }

        Calendar selectedCal = (Calendar) calendar.clone();

        selectedCal.add(
                Calendar.DAY_OF_MONTH,
                selectedDateIndex
        );

        tvMonthYear.setText(
                new SimpleDateFormat(
                        "MMMM yyyy",
                        Locale.getDefault()
                ).format(selectedCal.getTime())
        );

        DateAdapter adapter = new DateAdapter(
                dates,
                selectedDateIndex,
                position -> {

                    selectedDateIndex = position;

                    Calendar sc = (Calendar) calendar.clone();

                    sc.add(Calendar.DAY_OF_MONTH, position);

                    tvMonthYear.setText(
                            new SimpleDateFormat(
                                    "MMMM yyyy",
                                    Locale.getDefault()
                            ).format(sc.getTime())
                    );
                }
        );

        rvDates.setLayoutManager(
                new LinearLayoutManager(
                        getContext(),
                        LinearLayoutManager.HORIZONTAL,
                        false
                )
        );

        rvDates.setAdapter(adapter);

        rvDates.scrollToPosition(selectedDateIndex);
    }

    // ════════════════════════════════════════════════════════════════════════
    // TIME SLOTS
    // ════════════════════════════════════════════════════════════════════════

    private void setupTimeSlots() {

        refreshSlotUI();

        for (int i = 0; i < slotViews.length; i++) {

            final int index = i;

            slotViews[i].setOnClickListener(v -> {

                selectedSlotIndex = index;

                refreshSlotUI();
            });
        }
    }

    private void refreshSlotUI() {

        for (int i = 0; i < slotViews.length; i++) {

            boolean selected = i == selectedSlotIndex;

            slotViews[i].setBackgroundResource(
                    selected
                            ? R.drawable.bg_time_slot_selected
                            : R.drawable.bg_time_slot_normal
            );

            TextView timeText = (TextView) slotViews[i].getChildAt(0);

            if (timeText != null) {

                timeText.setTextColor(
                        selected
                                ? Color.WHITE
                                : Color.parseColor("#374151")
                );
            }

            if (slotViews[i].getChildCount() > 1) {

                TextView tagText =
                        (TextView) slotViews[i].getChildAt(1);

                if (tagText != null) {

                    tagText.setVisibility(
                            selected ? View.VISIBLE : View.GONE
                    );
                }
            }
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // SERVICE TYPES
    // ════════════════════════════════════════════════════════════════════════

    private void setupServiceTypes() {

        List<ServiceType> serviceTypes = Arrays.asList(

                new ServiceType(
                        1,
                        "Internal Wiring",
                        749
                ),

                new ServiceType(
                        2,
                        "Appliance Repair",
                        999
                ),

                new ServiceType(
                        3,
                        "Fan Installation",
                        499
                ),

                new ServiceType(
                        4,
                        "Switch Board",
                        299
                ),

                new ServiceType(
                        5,
                        "MCB Replacement",
                        599
                ),

                new ServiceType(
                        6,
                        "Light Fitting",
                        399
                )
        );

        serviceTypeAdapter = new ServiceTypeAdapter(
                serviceTypes,
                serviceType -> {

                    updateEstimatePrice(serviceType.basePrice);

                    animatePrice();
                }
        );

        rvServiceTypes.setLayoutManager(
                new LinearLayoutManager(
                        requireContext(),
                        LinearLayoutManager.HORIZONTAL,
                        false
                )
        );

        rvServiceTypes.setHasFixedSize(true);

        rvServiceTypes.setAdapter(serviceTypeAdapter);

        // Default selected price
        ServiceType defaultService =
                serviceTypeAdapter.getSelected();

        if (defaultService != null) {

            updateEstimatePrice(defaultService.basePrice);
        }
    }

    private void updateEstimatePrice(int amount) {

        tvPrice.setText("₹" + amount + ".00");
    }

    private void animatePrice() {

        tvPrice.animate()
                .scaleX(1.08f)
                .scaleY(1.08f)
                .setDuration(90)
                .withEndAction(() ->
                        tvPrice.animate()
                                .scaleX(1f)
                                .scaleY(1f)
                                .setDuration(120)
                                .start()
                )
                .start();
    }

    // ════════════════════════════════════════════════════════════════════════
    // LISTENERS
    // ════════════════════════════════════════════════════════════════════════

    private void setupListeners(View root) {

        root.findViewById(R.id.btnBack)
                .setOnClickListener(v -> {

                    if (getParentFragmentManager()
                            .getBackStackEntryCount() > 0) {

                        getParentFragmentManager()
                                .popBackStack();
                    }
                });

        root.findViewById(R.id.tvChangeAddress)
                .setOnClickListener(v ->

                        Toast.makeText(
                                getContext(),
                                "Change address clicked",
                                Toast.LENGTH_SHORT
                        ).show()
                );

        btnRequestQuote.setOnClickListener(v -> {

            submitQuotation();
        });
    }

    // ════════════════════════════════════════════════════════════════════════
    // SUBMIT
    // ════════════════════════════════════════════════════════════════════════

    private void submitQuotation() {

        ServiceType selectedService =
                serviceTypeAdapter.getSelected();

        String notes;

        if (etNotes.getText() != null) {

            notes = etNotes.getText().toString().trim();
        } else {
            notes = "";
        }

        btnRequestQuote.animate()
                .scaleX(0.94f)
                .scaleY(0.94f)
                .setDuration(80)
                .withEndAction(() ->

                        btnRequestQuote.animate()
                                .scaleX(1f)
                                .scaleY(1f)
                                .setDuration(120)
                                .withEndAction(() -> {

                                    String message =
                                            "Quotation Request Sent\n\n" +
                                                    "Service : " + selectedService.label +
                                                    "\nPrice : ₹" + selectedService.basePrice +
                                                    "\nSlot : " + TIME_SLOTS[selectedSlotIndex] +
                                                    "\nNotes : " + notes;

                                    Toast.makeText(
                                            getContext(),
                                            message,
                                            Toast.LENGTH_LONG
                                    ).show();

                                })
                                .start()
                )
                .start();
    }

    // ════════════════════════════════════════════════════════════════════════
    // ENTRY ANIMATION
    // ════════════════════════════════════════════════════════════════════════

    private void animateIn(View root) {

        root.setAlpha(0f);

        root.setTranslationY(48f);

        root.animate()
                .alpha(1f)
                .translationY(0f)
                .setDuration(320)
                .setInterpolator(
                        new DecelerateInterpolator(1.6f)
                )
                .start();
    }

    // ════════════════════════════════════════════════════════════════════════
    // DATE MODEL
    // ════════════════════════════════════════════════════════════════════════

    private static class DateItem {

        final String day;
        final String date;

        DateItem(String day, String date) {

            this.day = day;
            this.date = date;
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // DATE SELECT CALLBACK
    // ════════════════════════════════════════════════════════════════════════

    interface OnDateSelected {

        void onSelect(int position);
    }

    // ════════════════════════════════════════════════════════════════════════
    // DATE ADAPTER
    // ════════════════════════════════════════════════════════════════════════

    private static class DateAdapter
            extends RecyclerView.Adapter<DateAdapter.VH> {

        private final List<DateItem> items;

        private int selectedPos;

        private final OnDateSelected listener;

        DateAdapter(
                List<DateItem> items,
                int selectedPos,
                OnDateSelected listener
        ) {

            this.items = items;
            this.selectedPos = selectedPos;
            this.listener = listener;
        }

        @NonNull
        @Override
        public VH onCreateViewHolder(
                @NonNull ViewGroup parent,
                int viewType
        ) {

            View view = LayoutInflater.from(
                    parent.getContext()
            ).inflate(
                    R.layout.item_date_chip,
                    parent,
                    false
            );

            return new VH(view);
        }

        @Override
        public void onBindViewHolder(
                @NonNull VH holder,
                int position
        ) {

            DateItem item = items.get(position);

            boolean selected =
                    position == selectedPos;

            holder.tvDay.setText(item.day);

            holder.tvDate.setText(item.date);

            holder.root.setBackgroundResource(
                    selected
                            ? R.drawable.bg_date_chip_selected
                            : R.drawable.bg_date_chip_normal
            );

            int primaryColor = selected
                    ? Color.WHITE
                    : Color.parseColor("#111827");

            int secondaryColor = selected
                    ? Color.parseColor("#DDD6FE")
                    : Color.parseColor("#6B7280");

            holder.tvDate.setTextColor(primaryColor);

            holder.tvDay.setTextColor(secondaryColor);

            holder.root.setOnClickListener(v -> {

                int old = selectedPos;

                selectedPos = holder.getAdapterPosition();

                notifyItemChanged(old);

                notifyItemChanged(selectedPos);

                listener.onSelect(selectedPos);
            });
        }

        @Override
        public int getItemCount() {

            return items.size();
        }

        static class VH extends RecyclerView.ViewHolder {

            View root;

            TextView tvDay;
            TextView tvDate;

            VH(@NonNull View itemView) {

                super(itemView);

                root = itemView.findViewById(R.id.dateChipRoot);

                tvDay = itemView.findViewById(R.id.tvDay);

                tvDate = itemView.findViewById(R.id.tvDateNum);
            }
        }
    }
}