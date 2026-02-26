import { createTuyau } from "@tuyau/core/client";
import { registry } from "#tuyau";

export const tuyau = createTuyau({
	baseUrl: window.location.origin,
	registry,
});
