import React, { useEffect, useState } from 'react';
import { SYNC_STATUS, getSyncState, retryNow, subscribe } from '../backend/sync';

/**
 * The one honest sentence about whether this browser agrees with the server.
 *
 * `synced` is only ever printed from the state the sync module sets after a push
 * resolved, so there is no path where this component says "synced" because a
 * request was sent rather than because it succeeded.
 */

const WORDING = {
  [SYNC_STATUS.IDLE]: 'Not synced yet.',
  [SYNC_STATUS.SYNCING]: 'Syncing your progress.',
  [SYNC_STATUS.SYNCED]: 'Synced. This device and the account match.',
  [SYNC_STATUS.OFFLINE]: 'Offline. Your progress is saved here and will be copied when you reconnect.',
  [SYNC_STATUS.FAILED]: 'That did not go through. Your progress is still saved here.',
};

function SyncStatus() {
  const [syncState, setSyncState] = useState(getSyncState);

  useEffect(() => subscribe(setSyncState), []);

  const status = syncState.status;
  const retryable = status === SYNC_STATUS.FAILED || status === SYNC_STATUS.OFFLINE;

  return (
    <div className="st-sync" role="status" aria-live="polite">
      <p className="st-sync-line">{WORDING[status] || WORDING[SYNC_STATUS.IDLE]}</p>
      {status === SYNC_STATUS.SYNCED && syncState.lastSyncedAt && (
        <p className="st-sync-line st-sync-quiet">
          Last copied {new Date(syncState.lastSyncedAt).toLocaleTimeString()}.
        </p>
      )}
      {retryable && (
        <>
          <p className="st-sync-line st-sync-quiet">{syncState.error}</p>
          <button type="button" className="st-choice" onClick={() => retryNow()}>
            Retry
          </button>
        </>
      )}
    </div>
  );
}

export default SyncStatus;
