/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Clé publique FedaPay (pk_sandbox_... ou pk_live_...) */
  readonly VITE_FEDAPAY_PUBLIC_KEY?: string;
  /** Environnement FedaPay : "sandbox" (défaut) ou "live" */
  readonly VITE_FEDAPAY_ENVIRONMENT?: 'sandbox' | 'live';
}

interface FedaPayTransaction {
  id?: number | string;
  reference?: string;
  status?: string;
}

interface FedaPayWidget {
  open: () => void;
}

interface FedaPaySDK {
  init: (config: Record<string, unknown>) => FedaPayWidget;
  CHECKOUT_COMPLETED: number;
  DIALOG_DISMISSED: number;
}

interface Window {
  FedaPay?: FedaPaySDK;
}
