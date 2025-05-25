import Link from 'next/link';

type Campaign = {
  campaignId: string;
  title: string;
  description: string;
  targetAmount: number;
  fundsCollected: number;
  startDate: string;
  endDate: string;
  fundraiserId: string;
  status: string;
};

// color palette
const appColors = {
  babyPinkLight: '#FDECF0',
  babyTurquoiseLight: '#E0FCFA',
  lightGrayBg: '#F3F4F6',
  white: '#FFFFFF',

  textDark: '#374151',
  textDarkMuted: '#525E6C',

  babyPinkAccent: '#D94A7B',
  babyTurquoiseAccent: '#36A5A0',
};

export default async function CampaignSection() {
  let data: Campaign[] = [];

  try {
    const res = await fetch('http://localhost:8080/api/campaign', {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Gagal mengambil data campaign');
    }

    data = await res.json();
  } catch (err) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center" style={{ backgroundColor: appColors.lightGrayBg }}>
        <p className="text-center text-lg font-medium" style={{ color: appColors.babyPinkAccent }}>
          Gagal mengambil data campaign. Silakan coba lagi nanti.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen" style={{ backgroundColor: appColors.lightGrayBg }}>
      <h1 className="text-3xl font-bold text-center mb-8" style={{ color: appColors.textDark }}>
        🎁 Fundraising Tersedia
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data.map((item) => {
          const percentage =
            item.targetAmount > 0
              ? Math.min(100, Math.round((item.fundsCollected / item.targetAmount) * 100))
              : 0;

          return (
            <Link
              key={item.campaignId}
              href={`/campaign/${item.campaignId}`}
              aria-label={`Lihat detail campaign ${item.title}`}
              className="block"
            >
              <div
                className="rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 h-full flex flex-col justify-between p-6"
                style={{ backgroundColor: appColors.white}}
              >

                <div>
                  <h2 className="text-lg font-semibold mb-2" style={{ color: appColors.textDark }}>
                    {item.title}
                  </h2>
                  <p className="text-sm mb-4 line-clamp-3" style={{ color: appColors.textDarkMuted }}>
                    {item.description}
                  </p>
                </div>

                <div>
                  <div className="w-full rounded-full h-3 mb-2" style={{ backgroundColor: '#E5E7EB' }}>
                    <div
                      className="h-3 rounded-full"
                      style={{ width: `${percentage}%`, backgroundColor: appColors.babyTurquoiseAccent }}
                    ></div>
                  </div>

                  <div className="text-sm flex justify-between" style={{ color: appColors.textDarkMuted }}>
                    <span className="font-medium" style={{ color: appColors.babyTurquoiseAccent }}>
                      Rp {item.fundsCollected.toLocaleString()}
                    </span>
                    <span>/ Rp {item.targetAmount.toLocaleString()}</span>
                  </div>

                  <div className="mt-3 text-right">
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: appColors.babyTurquoiseLight,
                        color: appColors.babyTurquoiseAccent,
                      }}
                      title={`Telah terkumpul sebesar ${percentage}% dari target`}
                    >
                      {percentage}% Terkumpul
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
