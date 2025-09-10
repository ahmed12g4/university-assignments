import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

// ✅ تعريف الـ props كـ JSDoc عشان يشتغل في JS و TS بدون Errors
/**
 * @param {Object} props
 * @param {boolean} props.open - هل المودال مفتوح؟
 * @param {string} props.title - عنوان المودال
 * @param {string} props.message - الرسالة داخل المودال
 * @param {() => void} props.onConfirm - دالة عند الضغط على تأكيد
 * @param {() => void} props.onCancel - دالة عند الضغط على إلغاء
 */
const ConfirmModal = (props) => {
    // eslint-disable-next-line react/prop-types
    const { open, title, message, onConfirm, onCancel } = props;

    if (!open) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                >
                    <div className="mb-4 flex items-center gap-3">
                        <AlertTriangle
                            className="text-red-500"
                            size={28}
                        />
                        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                    </div>
                    <p className="mb-6 text-gray-600">{message}</p>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onCancel}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-600 transition hover:bg-gray-100"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={onConfirm}
                            className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                        >
                            تأكيد
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ConfirmModal;
