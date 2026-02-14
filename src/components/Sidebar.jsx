import CompanyFilter from './CompanyFilter';
import ShareholderFilter from './ShareholderFilter';

export default function Sidebar({
  companies,
  shareholders,
  shareholderList,
  selectedCompanies,
  selectedShareholders,
  onToggleCompany,
  onSelectAllCompanies,
  onClearAllCompanies,
  onToggleShareholder,
  onSelectAllShareholders,
  onClearAllShareholders,
  topN,
  onTopNChange,
  minPercentage,
  onMinPercentageChange,
  regexMode,
  onRegexModeChange
}) {
  return (
    <div className="w-80 bg-dark-800 border-r border-dark-700 flex flex-col h-full">
      {/* Company Filter - Fixed height with scroll */}
      <div className="h-1/3 border-b border-dark-700">
        <CompanyFilter
          companies={companies}
          selectedCompanies={selectedCompanies}
          onToggleCompany={onToggleCompany}
          onSelectAll={onSelectAllCompanies}
          onClearAll={onClearAllCompanies}
        />
      </div>
      
      {/* Shareholder Filter - Flex grow with scroll */}
      <div className="flex-1 min-h-0">
        <ShareholderFilter
          shareholderList={shareholderList}
          selectedShareholders={selectedShareholders}
          onToggleShareholder={onToggleShareholder}
          onSelectAll={onSelectAllShareholders}
          onClearAll={onClearAllShareholders}
          topN={topN}
          onTopNChange={onTopNChange}
          minPercentage={minPercentage}
          onMinPercentageChange={onMinPercentageChange}
          regexMode={regexMode}
          onRegexModeChange={onRegexModeChange}
        />
      </div>
    </div>
  );
}
