package in.researchdevs.quickkarigar.ui.address;

import android.content.Context;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.GradientDrawable;
import android.graphics.drawable.RippleDrawable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

import in.researchdevs.quickkarigar.R;

public class AddressAdapter extends RecyclerView.Adapter<AddressAdapter.ViewHolder> {

    public interface Listener {
        void onAddressClick(Address address);
        void onEditClick(Address address);
    }

    private List<Address> list;
    private Listener listener;

    private int selectedAddressId; // SOURCE OF TRUTH

    public AddressAdapter(List<Address> list, int selectedAddressId, Listener listener) {
        this.list = list;
        this.listener = listener;
        this.selectedAddressId = selectedAddressId;
    }

    // REQUIRED METHOD
    public void setSelectedId(int id) {
        this.selectedAddressId = id;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_address, parent, false);
        return new ViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder h, int position) {

        Address a = list.get(position);

        h.title.setText(a.title);
        h.subtitle.setText(a.fullAddress);

        //  FIXED ICON
        h.icon.setImageResource(a.iconRes);

        boolean isSelected = (a.id == selectedAddressId);

        // DEFAULT TAG
        h.defaultTag.setVisibility(isSelected ? View.VISIBLE : View.GONE);

        // BACKGROUND
        h.itemView.setBackground(getRipple(h.itemView.getContext(), isSelected));

        // CLICK
        h.itemView.setOnClickListener(v -> {

            int adapterPosition = h.getAdapterPosition();
            if (adapterPosition == RecyclerView.NO_POSITION) return;

            Address clicked = list.get(adapterPosition);

            // animation
            v.animate().scaleX(0.96f).scaleY(0.96f).setDuration(80).withEndAction(() -> {
                v.animate().scaleX(1f).scaleY(1f).setDuration(80).start();
            }).start();

            selectedAddressId = clicked.id;

            notifyDataSetChanged();

            listener.onAddressClick(clicked);
        });

        // EDIT CLICK
        h.editBtn.setOnClickListener(v -> {
            int adapterPosition = h.getAdapterPosition();
            if (adapterPosition == RecyclerView.NO_POSITION) return;

            Address address = list.get(adapterPosition);

            android.widget.Toast.makeText(
                    v.getContext(),
                    "Edit Address ID: " + address.id + "\nUnder Development",
                    android.widget.Toast.LENGTH_SHORT
            ).show();
            // Optional: still trigger callback if needed later
            if (listener != null) {
                listener.onEditClick(address);
            }
        });
    }

    @Override
    public int getItemCount() {
        return list.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {

        ImageView icon, editBtn;
        TextView title, subtitle, defaultTag;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);

            icon = itemView.findViewById(R.id.icon);
            editBtn = itemView.findViewById(R.id.editBtn);
            title = itemView.findViewById(R.id.title);
            subtitle = itemView.findViewById(R.id.subtitle);
            defaultTag = itemView.findViewById(R.id.defaultTag);
        }
    }

    private Drawable getRipple(Context ctx, boolean selected) {

        GradientDrawable bg = new GradientDrawable();
        bg.setCornerRadius(24f);

        if (selected) {
            bg.setColor(Color.parseColor("#EEF0FF"));
            bg.setStroke(2, Color.parseColor("#D6DBFF"));
        } else {
            bg.setColor(Color.WHITE);
            bg.setStroke(2, Color.parseColor("#EEEEEE"));
        }

        return new RippleDrawable(
                ColorStateList.valueOf(Color.parseColor("#22000000")),
                bg,
                null
        );
    }
}