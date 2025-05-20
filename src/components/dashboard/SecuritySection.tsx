import React from 'react';
import IpWhitelistManager from './IpWhitelistManager';
import Loading from '../ui/Loading';
import { useIpWhitelist } from '@/src/hooks/useIpWhitelist';

const SecuritySection: React.FC = () => {
  const {
    ipWhitelist,
    whitelistEnabled,
    newIpAddress,
    setNewIpAddress,
    newIpDescription,
    setNewIpDescription,
    ipError,
    ipSuccess,
    loading,
    handleAddIp,
    handleRemoveIp,
    handleToggleIpStatus,
    handleToggleWhitelist
  } = useIpWhitelist();

  if (loading) {
    return <Loading message="Loading security settings..." />;
  }

  return (
    <div className="space-y-6">
      {/* IP Whitelist */}
      <IpWhitelistManager 
        ipWhitelist={ipWhitelist}
        whitelistEnabled={whitelistEnabled}
        newIpAddress={newIpAddress}
        setNewIpAddress={setNewIpAddress}
        newIpDescription={newIpDescription}
        setNewIpDescription={setNewIpDescription}
        ipError={ipError}
        ipSuccess={ipSuccess}
        handleAddIp={handleAddIp}
        handleRemoveIp={handleRemoveIp}
        handleToggleIpStatus={handleToggleIpStatus}
        handleToggleWhitelist={handleToggleWhitelist}
      />
      
      {/* Additional security components can be added here */}
    </div>
  );
};

export default SecuritySection;