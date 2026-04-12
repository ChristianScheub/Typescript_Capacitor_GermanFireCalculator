import React from "react";
import UsedLibListScreen from "./screen_usedLibList";
import licensesData from "./licenses.json";

interface LicenseInfo {
    licenses: string;
    repository: string;
    publisher?: string;
    url?: string;
    path: string;
    licenseFile: string;
  }
  
  interface LicensesObject {
    [packageName: string]: LicenseInfo;
  }
  
  interface NpmModule {
    name: string;
    version: string;
    licenses: string;
    repository: string;
  }
  

const UsedLibsListContainer: React.FC = () => {

  const npmModules: NpmModule[] = Object.entries(licensesData as unknown as LicensesObject).map(([key, value]) => {
    const [name, version] = key.split('@');
    return {
      name,
      version: version,
      licenses: value.licenses,
      repository: value.repository
    };
  });

  return (
    <div>
      <UsedLibListScreen
        npmModules={npmModules}
      />
    </div>
  );
};

export default UsedLibsListContainer;