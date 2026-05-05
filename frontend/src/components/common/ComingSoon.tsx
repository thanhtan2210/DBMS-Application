import { useNavigate } from "react-router-dom";
import { Construction } from "lucide-react";

export function ComingSoon() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8 text-center">
      <Construction className="w-16 h-16 text-stellar-accent" />
      <h2 className="text-2xl font-bold uppercase tracking-tighter">Tính năng đang phát triển</h2>
      <p className="text-stellar-muted max-w-sm">Tính năng này đang trong quá trình phát triển và sẽ sớm ra mắt trong các phiên bản cập nhật tới.</p>
      <button 
        onClick={() => navigate("/")}
        className="mt-4 px-6 py-2 bg-stellar-accent text-white rounded-full font-bold uppercase tracking-widest text-xs"
      >
        Quay lại trang chủ
      </button>
    </div>
  );
}
