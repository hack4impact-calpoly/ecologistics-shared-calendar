import React, { useMemo } from "react";
import { EventDocument } from "../database/eventSchema";

type CalendarFilterModalProps = {
  events: EventDocument[];
  hiddenOrganizations: string[];
  onHiddenOrganizationsChange: (organizations: string[]) => void;
  showVirtual: boolean;
  onShowVirtualChange: (showVirtual: boolean) => void;
  showInPerson: boolean;
  onShowInPersonChange: (showInPerson: boolean) => void;
  onClose: () => void;
};

export default function CalendarFilterModal({
  events,
  hiddenOrganizations,
  onHiddenOrganizationsChange,
  showVirtual,
  onShowVirtualChange,
  showInPerson,
  onShowInPersonChange,
  onClose,
}: CalendarFilterModalProps) {
  const organizations = useMemo(() => {
    return Array.from(
      new Set(events.map((event) => event.organization).filter(Boolean)),
    ).sort();
  }, [events]);

  const handleOrganizationChange = (organization: string, checked: boolean) => {
    if (checked) {
      onHiddenOrganizationsChange(
        hiddenOrganizations.filter((name) => name !== organization),
      );
      return;
    }

    onHiddenOrganizationsChange([...hiddenOrganizations, organization]);
  };

  return (
    <>
      <div style={styles.overlay} onClick={onClose} />
      <div style={styles.modal}>
        <button style={styles.closeButton} onClick={onClose} type="button">
          x
        </button>
        <h2 style={styles.title}>Filter Events</h2>
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Organizations</h3>
          <div style={styles.options}>
            {organizations.length > 0 ? (
              organizations.map((organization) => (
                <label key={organization} style={styles.option}>
                  <input
                    type="checkbox"
                    checked={!hiddenOrganizations.includes(organization)}
                    onChange={(event) =>
                      handleOrganizationChange(
                        organization,
                        event.target.checked,
                      )
                    }
                  />
                  {organization}
                </label>
              ))
            ) : (
              <p style={styles.emptyText}>No organizations available.</p>
            )}
          </div>
        </div>
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Location</h3>
          <div style={styles.options}>
            <label style={styles.option}>
              <input
                type="checkbox"
                checked={showVirtual}
                onChange={(event) => onShowVirtualChange(event.target.checked)}
              />
              Virtual
            </label>
            <label style={styles.option}>
              <input
                type="checkbox"
                checked={showInPerson}
                onChange={(event) => onShowInPersonChange(event.target.checked)}
              />
              In Person
            </label>
          </div>
        </div>
        <button style={styles.applyButton} onClick={onClose} type="button">
          Apply
        </button>
      </div>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.6)",
    zIndex: 999,
  },
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "420px",
    maxWidth: "90vw",
    maxHeight: "85vh",
    overflowY: "auto",
    background: "white",
    borderRadius: "12px",
    padding: "24px",
    zIndex: 1000,
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    whiteSpace: "normal",
  },
  closeButton: {
    position: "absolute",
    top: "12px",
    right: "16px",
    background: "transparent",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
  },
  title: {
    margin: "0 0 20px",
    fontSize: "1.5rem",
  },
  section: {
    marginBottom: "20px",
  },
  sectionTitle: {
    margin: "0 0 12px",
    fontSize: "1rem",
  },
  options: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  option: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.95rem",
  },
  emptyText: {
    margin: 0,
    color: "#666",
  },
  applyButton: {
    backgroundColor: "#F7AB74",
    color: "black",
    border: "none",
    padding: "10px 20px",
    borderRadius: "20px",
    cursor: "pointer",
  },
};
