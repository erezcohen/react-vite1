import { Link } from 'react-router-dom';

// Local SVG assets (downloaded from Figma)
const imgVector0 = '/assets/triangle-vector-0.svg';
const imgVector1 = '/assets/triangle-vector-1.svg';

export function AppLogo() {
  return (
    <Link
      to="/data-centers"
      className="flex items-center gap-4 hover:opacity-80 transition-opacity"
    >
      <div className="relative size-4">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-full overflow-clip relative w-4">
          {/* Vector 0 - First part of triangle icon */}
          <div className="absolute left-0 size-4 top-0">
            <div className="absolute bottom-[29.51%] left-[13.841%] right-[13.841%] top-[14.354%]">
              <img
                alt=""
                className="block max-w-none size-full"
                src={imgVector0}
              />
            </div>
          </div>
          {/* Vector 1 - Second part of triangle icon */}
          <div className="absolute left-0 size-4 top-0">
            <div className="absolute bottom-[8.333%] left-[8.333%] right-[8.333%] top-[10.188%]">
              <img
                alt=""
                className="block max-w-none size-full"
                src={imgVector1}
              />
            </div>
          </div>
        </div>
      </div>
      <span className="font-['Inter:Bold',_sans-serif] font-bold text-[18px] leading-[23px] text-[#0d0f1c] text-nowrap">
        DCMS
      </span>
    </Link>
  );
}
