import {AddressType} from '@/screens/auth/common/Address/AddressManagement';
import {create} from 'zustand';

type useAddressI = {
  addresses: AddressType[];
  selectedAddress: AddressType | null;
  addressLoading: boolean;
  setSelectedAddress: (address: AddressType | null) => void;
  setAddresses: (addresses: AddressType[]) => void;
  appendAddresses: (addresses: AddressType) => void;
  setAddressLoading: (addressLoading: boolean) => void;
};

const useAddress = create<useAddressI>((set, get) => ({
  addresses: [],
  selectedAddress: null,
  addressLoading: false,
  setSelectedAddress: selectedAddress => set({selectedAddress}),
  setAddresses: addresses => set({addresses}),
  appendAddresses: address => {
    set({addresses: [...get().addresses, address]});
  },
  setAddressLoading: addressLoading => set({addressLoading}),
}));

export default useAddress;
export type {useAddressI};
