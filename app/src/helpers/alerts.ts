export async function toastError(
  message: string,
  didClose = () => {}
) {
  const { default: swal } = await import("sweetalert2");

  swal.fire({
    icon: "error",
    title: message,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    didClose
  });
}

export async function toastSuccess(
  message: string,
  didClose = () => {}
) {
  const { default: swal } = await import("sweetalert2");

  swal.fire({
    icon: "success",
    title: message,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    didClose
  });
}

export async function toastWarning(
  message: string,
  didClose = () => {}
) {
  const { default: swal } = await import("sweetalert2");

  swal.fire({
    icon: "warning",
    title: message,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    didClose
  });
}

export async function popupError(message: string, didClose = () => {}) {
  const { default: swal } = await import("sweetalert2");

  swal.fire({
    icon: "error",
    text: message,
    didClose
  });
}

export async function popupSuccess(message: string, didClose = () => {}) {
  const { default: swal } = await import("sweetalert2");

  swal.fire({ icon: "success", text: message , didClose});
}

export async function popupWarning(message: string, didClose = () => {}) {
  const { default: swal } = await import("sweetalert2");

  swal.fire({ icon: "warning", text: message, didClose });
}
