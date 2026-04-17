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
        list.clear();
        list.addAll(data);
    }

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

        adapter = new AddressAdapter(list, selectedAddressId, new AddressAdapter.Listener() {

            @Override
            public void onAddressClick(Address address) {

                selectedAddressId = address.id;
                adapter.setSelectedId(selectedAddressId);

                if (callback != null) {
                    // create copy → prevent external modification
                    Address safeAddress = new Address(
                            address.id,
                            address.house,
                            address.area,
                            address.city,
                            address.pincode,
                            address.isDefault,
                            address.iconRes
                    );
                    callback.onAddressSelected(safeAddress);
                }


                dismiss();
            }

            @Override
            public void onEditClick(Address address) {
                openEditSheet(address);
            }
        });

        recyclerView.setAdapter(adapter);

        // CLOSE
        btnClose.setOnClickListener(v -> dismiss());

        // ADD NEW
        btnAdd.setOnClickListener(v -> openAddSheet());

        return view;
    }

    // ================= ADD =================

    private void openAddSheet() {

        AddAddressBottomSheet sheet = new AddAddressBottomSheet();

        sheet.setCallback(newAddress -> {

            if (newAddress.isDefault) {
                for (Address a : list) {
                    a.isDefault = false;
                }
            }

            newAddress.updateDerivedFields();

            list.add(newAddress);

            selectedAddressId = newAddress.id;

            adapter.notifyItemInserted(list.size() - 1);
            adapter.setSelectedId(selectedAddressId);

            if (callback != null) {
                callback.onAddressSelected(newAddress);
            }
        });

        sheet.show(getParentFragmentManager(), "AddAddress");
    }

    // ================= EDIT =================

    private void openEditSheet(Address address) {

        AddAddressBottomSheet sheet = new AddAddressBottomSheet();
        sheet.setEditAddress(address);

        sheet.setCallback(updated -> {

            for (int i = 0; i < list.size(); i++) {

                if (list.get(i).id == updated.id) {

                    if (updated.isDefault) {
                        for (Address a : list) {
                            a.isDefault = false;
                        }
                    }

                    updated.updateDerivedFields();

                    list.set(i, updated);

                    selectedAddressId = updated.id;

                    adapter.setSelectedId(selectedAddressId);
                    adapter.notifyItemChanged(i);

                    if (callback != null) {
                        callback.onAddressSelected(updated);
                    }

                    break;
                }
            }
        });

        sheet.show(getParentFragmentManager(), "EditAddress");
    }
}