import React from "react";

interface NpmModule {
  name: string;
  version: string;
  licenses: string;
  repository: string;
}

interface UsedLibListScreenProps {
  npmModules: NpmModule[];
}

const UsedLibListScreen: React.FC<UsedLibListScreenProps> = ({
  npmModules,
}) => {
  const handleModuleClick = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div>
      <div data-testid="used-lib-list-modal">
        {npmModules.map((module, index) => (
          <div
            key={module.name+module.version+index}
            onClick={() => handleModuleClick(module.repository)}
            style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #ddd' }}
          >
            <div><strong>{module.name}@{module.version}</strong></div>
            <div>License: {module.licenses}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsedLibListScreen;