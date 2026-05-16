package in.researchdevs.quickkarigar.adapter;

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
import in.researchdevs.quickkarigar.model.Address;

public class AddressAdapter extends RecyclerView.Adapter<AddressAdapter.ViewHolder> {

    public interface Listener {
        void onAddressClick(Address address);
        void onEditClick(Address address);
    }

    private List<Address> list;
    private Listener listener;
    private int selectedAddressId;

    public AddressAdapter(List<Address> list, int selectedAddressId, Listener listener) {
        this.list = list;
        this.listener = listener;
        this.selectedAddressId = selectedAddressId;
    }

    // bg_add_address_inputOptimized selection update (no full refresh)
    public void setSelectedId(int id) {
        int oldId = this.selectedAddressId;
        this.selectedAddressId = id;

        int oldPos = -1;
        int newPos = -1;

        for (int i = 0; i < list.size(); i++) {
            if (list.get(i).id == oldId) oldPos = i;
            if (list.get(i).id == id) newPos = i;
        }

        if (oldPos != -1) notifyItemChanged(oldPos);
        if (newPos != -1) notifyItemChanged(newPos);
    }

    // bg_add_address_inputUpdate list (after edit/add/delete)
    public void updateList(List<Address> newList) {
        this.list = newList;
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

        // bg_add_address_inputAlways keep derived fields safe
        a.updateDerivedFields();

        h.title.setText(a.title);
        h.subtitle.setText(a.fullAddress);
        h.icon.setImageResource(a.iconRes);

        boolean isSelected = (a.id == selectedAddressId);

        // bg_add_address_inputDEFAULT TAG (based on model, not selection)
        h.defaultTag.setVisibility(a.isDefault ? View.VISIBLE : View.GONE);

        // bg_add_address_inputBackground
        h.itemView.setBackground(getRipple(h.itemView.getContext(), isSelected));

        // bg_add_address_inputCLICK (Select Address)
        h.itemView.setOnClickListener(v -> {

            int pos = h.getAdapterPosition();
            if (pos == RecyclerView.NO_POSITION) return;

            Address clicked = list.get(pos);

            // animation
            v.animate().scaleX(0.96f).scaleY(0.96f).setDuration(80)
                    .withEndAction(() ->
                            v.animate().scaleX(1f).scaleY(1f).setDuration(80).start()
                    ).start();

            setSelectedId(clicked.id);

            if (listener != null) {
                listener.onAddressClick(clicked);
            }
        });

        // bg_add_address_inputEDIT CLICK
        h.editBtn.setOnClickListener(v -> {
            v.setPressed(true); // force visual feedback

            int pos = h.getAdapterPosition();
            if (pos == RecyclerView.NO_POSITION) return;

            Address address = list.get(pos);

            if (listener != null) {
                listener.onEditClick(address);
            }
        });

        h.editBtn.setOnTouchListener((v, event) -> {
            v.getParent().requestDisallowInterceptTouchEvent(true);
            if (event.getAction() == android.view.MotionEvent.ACTION_UP) {
                v.performClick(); // REQUIRED
            }
            return true; // we handled it
        });
    }

    @Override
    public int getItemCount() {
        return list.size();
    }

    // ================= VIEW HOLDER =================

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

    // ================= UI BACKGROUND =================

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