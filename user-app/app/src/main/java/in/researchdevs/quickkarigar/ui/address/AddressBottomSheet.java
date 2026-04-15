package in.researchdevs.quickkarigar.ui.address;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.bottomsheet.BottomSheetDialogFragment;

import java.util.ArrayList;
import java.util.List;

import in.researchdevs.quickkarigar.R;

public class AddressBottomSheet extends BottomSheetDialogFragment {

    private RecyclerView recyclerView;
    private AddressAdapter adapter;

    private List<Address> list = new ArrayList<>();

    // source of truth for selection
    private int selectedAddressId = -1;

    public interface Callback {
        void onAddressSelected(Address address);
        void onAddNew();
        void onEdit(Address address);
    }

    private Callback callback;

    // ================= SETTERS =================

    public void setCallback(Callback callback) {
        this.callback = callback;
    }

    public void setData(List<Address> data) {
        this.list.clear();
        this.list.addAll(data);
    }

    // VERY IMPORTANT (used from HomeFragment)
    public void setSelectedAddressId(int id) {
        this.selectedAddressId = id;
    }

    // ================= UI =================

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.layout_saved_address_sheet, container, false);

        recyclerView = view.findViewById(R.id.addressRecycler);
        ImageView btnClose = view.findViewById(R.id.btnClose);
        View btnAdd = view.findViewById(R.id.btnAddAddress);

        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));

        // ================= ADAPTER =================
        adapter = new AddressAdapter(list, selectedAddressId, new AddressAdapter.Listener() {

            @Override
            public void onAddressClick(Address address) {

                // update selected id
                selectedAddressId = address.id;

                // update model (optional but good for consistency)
                for (Address a : list) {
                    a.isDefault = (a.id == selectedAddressId);
                }

                // update UI
                adapter.setSelectedId(selectedAddressId);

                // callback
                if (callback != null) {
                    callback.onAddressSelected(address);
                }

                dismiss();
            }

            @Override
            public void onEditClick(Address address) {
                if (callback != null) {
                    callback.onEdit(address);
                }
            }
        });

        recyclerView.setAdapter(adapter);

        // ================= ACTIONS =================
        btnClose.setOnClickListener(v -> dismiss());

        btnAdd.setOnClickListener(v -> {
            android.widget.Toast.makeText(
                    v.getContext(),
                    "Add New Address - Under Development",
                    android.widget.Toast.LENGTH_SHORT
            ).show();
            // Optional: keep callback for future
            if (callback != null) {
                callback.onAddNew();
            }
        });

        return view;
    }
}