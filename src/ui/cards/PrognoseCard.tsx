import { useTranslation } from 'react-i18next';
import type { PrognoseTableRow } from '../../types/prognose/PrognoseTableRow';

interface PrognoseCardProps {
  row: PrognoseTableRow;
}

export function PrognoseCard({ row }: Readonly<PrognoseCardProps>) {
  const { t } = useTranslation();

  return (
    <div key={row.year} className={`prognose-card${row.isFeatured ? ' prognose-card--featured' : ''}`}>
      <div className="prognose-card__header">
        <span className="prognose-card__year">
          {row.year}
          {row.isToday && <span className="prognose-card__tag prognose-card__tag--heute">{t('prognosis.today')}</span>}
        </span>
        <span className="prognose-card__badge">{row.badge}</span>
      </div>

      <div className="prognose-card__section">
        <p className="prognose-card__label">{t('prognosis.withdrawal')}</p>
        <p className="prognose-card__value">{row.entnahmeTotalFormatted}</p>
        <p className="prognose-card__sub">{t('prognosis.etf')} {row.entnahmeEtfFormatted} · {t('prognosis.cash')} {row.entnahmeCashFormatted}</p>
      </div>

      <div className="prognose-card__section">
        <p className="prognose-card__label">{t('prognosis.assets')}</p>
        <p className="prognose-card__value">{row.totalValueFormatted}</p>
        <p className="prognose-card__sub">{t('prognosis.etf')} {row.etfValueFormatted} · {t('prognosis.cash')} {row.cashValueFormatted}</p>
      </div>

      <div className="prognose-card__section">
        <p className="prognose-card__label">{t('prognosis.return')}</p>
        <p className="prognose-card__value">{row.renditeTotalFormatted}</p>
        <p className="prognose-card__sub">{t('prognosis.etf')} {row.etfRateDisplay} · {t('prognosis.cash')} {row.cashRateDisplay}</p>
      </div>
    </div>
  );
}
