package in.researchdevs.quickkarigar.ui.address;

import android.content.Context;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Switch;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.android.material.bottomsheet.BottomSheetDialogFragment;

import in.researchdevs.quickkarigar.R;
import in.researchdevs.quickkarigar.model.Address;

public class AddAddressBottomSheet extends BottomSheetDialogFragment {

    private EditText etHouse, etArea, etCity, etPincode;
    private Switch switchPrimary;
    private View btnSave;
    private TextView title;

    private Address editAddress; // for edit mode

    public interface Callback {
        void onAddressSaved(Address address);
    }

    private Callback callback;

    public void setCallback(Callback callback) {
        this.callback = callback;
    }

    // bg_add_address_inputcall this when editing
    public void setEditAddress(Address address) {
        this.editAddress = address;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.layout_add_address_sheet, container, false);

        // ================= BIND =================
        etHouse = view.findViewById(R.id.etHouse);
        etArea = view.findViewById(R.id.etArea);
        etCity = view.findViewById(R.id.etCity);
        etPincode = view.findViewById(R.id.etPincode);
        switchPrimary = view.findViewById(R.id.switchPrimary);
        btnSave = view.findViewById(R.id.btnSave);
        title = view.findViewById(R.id.title);

        ImageView btnClose = view.findViewById(R.id.btnClose);

        btnClose.setOnClickListener(v -> dismiss());

        // ================= EDIT MODE =================
        if (editAddress != null) {

            title.setText("Edit Address");

            etHouse.setText(editAddress.house);
            etArea.setText(editAddress.area);
            etCity.setText(editAddress.city);
            etPincode.setText(editAddress.pincode);
            switchPrimary.setChecked(editAddress.isDefault);

        } else {
            title.setText("Add New Address");
        }

        // ================= KEYBOARD =================
        etHouse.requestFocus();
        etHouse.post(() -> {
            InputMethodManager imm = (InputMethodManager)
                    requireContext().getSystemService(Context.INPUT_METHOD_SERVICE);
            if (imm != null) {
                imm.showSoftInput(etHouse, InputMethodManager.SHOW_IMPLICIT);
            }
        });

        // ================= SAVE =================
        btnSave.setOnClickListener(v -> saveAddress());

        return view;
    }

    private void saveAddress() {

        String house = etHouse.getText().toString().trim();
        String area = etArea.getText().toString().trim();
        String city = etCity.getText().toString().trim();
        String pincode = etPincode.getText().toString().trim();
        boolean isPrimary = switchPrimary.isChecked();

        // ================= VALIDATION =================

        if (TextUtils.isEmpty(house)) {
            etHouse.setError("Enter house / flat");
            return;
        }

        if (TextUtils.isEmpty(area)) {
            etArea.setError("Enter area");
            return;
        }

        if (TextUtils.isEmpty(city)) {
            etCity.setError("Enter city");
            return;
        }

        if (pincode.length() != 6) {
            etPincode.setError("Enter valid 6-digit pincode");
            return;
        }

        int id;

        if (editAddress != null) {
            id = editAddress.id; // keep same id
        } else {
            id = (int) System.currentTimeMillis();
        }

        // ================= CREATE MODEL =================
        Address address = new Address(
                id,
                house,
                area,
                city,
                pincode,
                isPrimary,
                R.drawable.ic_home // you can map icon later
        );

        // ================= CALLBACK =================
        if (callback != null) {
            callback.onAddressSaved(address);
        }

        dismiss();
    }
}