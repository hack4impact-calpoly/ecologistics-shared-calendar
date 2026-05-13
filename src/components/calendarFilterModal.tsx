import React, { useEffect, useMemo, useState } from "react";
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
  const [isVisible, setIsVisible] = useState(false);
  const [draftHiddenOrganizations, setDraftHiddenOrganizations] =
    useState(hiddenOrganizations);
  const [draftShowVirtual, setDraftShowVirtual] = useState(showVirtual);
  const [draftShowInPerson, setDraftShowInPerson] = useState(showInPerson);
  const organizations = useMemo(() => {
    return Array.from(
      new Set(events.map((event) => event.organization).filter(Boolean)),
    ).sort();
  }, [events]);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const isOrganizationShown = (organization: string) =>
    !draftHiddenOrganizations.includes(organization);

  const handleOrganizationChange = (organization: string, checked: boolean) => {
    if (checked) {
      setDraftHiddenOrganizations(
        draftHiddenOrganizations.filter((name) => name !== organization),
      );
      return;
    }

    setDraftHiddenOrganizations([...draftHiddenOrganizations, organization]);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 150);
  };

  const handleApply = () => {
    onHiddenOrganizationsChange(draftHiddenOrganizations);
    onShowVirtualChange(draftShowVirtual);
    onShowInPersonChange(draftShowInPerson);
    handleClose();
  };

  return (
    <>
      <div
        style={{
          ...styles.overlay,
          opacity: isVisible ? 1 : 0,
        }}
        onClick={handleClose}
      />
      <div
        style={{
          ...styles.modal,
          opacity: isVisible ? 1 : 0,
          transform: isVisible
            ? "translate(-50%, -50%) scale(1)"
            : "translate(-50%, -48%) scale(0.98)",
        }}
      >
        <button style={styles.closeButton} onClick={handleClose} type="button">
          x
        </button>
        <h2 style={styles.title}>Filter Events</h2>
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Organizations</h3>
          <div style={styles.options}>
            {organizations.length > 0 ? (
              organizations.map((organization) => (
                <button
                  key={organization}
                  type="button"
                  aria-pressed={isOrganizationShown(organization)}
                  style={{
                    ...styles.filterButton,
                    ...(isOrganizationShown(organization)
                      ? styles.filterButtonActive
                      : styles.filterButtonInactive),
                  }}
                  onClick={() =>
                    handleOrganizationChange(
                      organization,
                      !isOrganizationShown(organization),
                    )
                  }
                >
                  {organization}
                </button>
              ))
            ) : (
              <p style={styles.emptyText}>No organizations available.</p>
            )}
          </div>
        </div>
        <div style={styles.divider} />
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Location</h3>
          <div style={styles.options}>
            <button
              type="button"
              aria-pressed={draftShowVirtual}
              style={{
                ...styles.filterButton,
                ...(draftShowVirtual
                  ? styles.filterButtonActive
                  : styles.filterButtonInactive),
              }}
              onClick={() => setDraftShowVirtual(!draftShowVirtual)}
            >
              Virtual
            </button>
            <button
              type="button"
              aria-pressed={draftShowInPerson}
              style={{
                ...styles.filterButton,
                ...(draftShowInPerson
                  ? styles.filterButtonActive
                  : styles.filterButtonInactive),
              }}
              onClick={() => setDraftShowInPerson(!draftShowInPerson)}
            >
              In Person
            </button>
          </div>
        </div>
        <button style={styles.applyButton} onClick={handleApply} type="button">
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
    transition: "opacity 150ms ease",
  },
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    width: "380px",
    maxWidth: "90vw",
    maxHeight: "75vh",
    overflowY: "auto",
    background: "white",
    borderRadius: "16px",
    padding: "24px 22px",
    zIndex: 1000,
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    whiteSpace: "normal",
    fontFamily: '"DM Sans", sans-serif',
    transition: "opacity 150ms ease, transform 150ms ease",
  },
  closeButton: {
    position: "absolute",
    top: "12px",
    right: "16px",
    background: "transparent",
    border: "none",
    fontSize: "20px",
    fontFamily: '"DM Sans", sans-serif',
    cursor: "pointer",
  },
  title: {
    margin: "0 0 20px",
    color: "#335543",
    fontSize: "1.4rem",
    fontWeight: 700,
    fontFamily: '"DM Sans", sans-serif',
  },
  section: {
    marginBottom: "20px",
  },
  sectionTitle: {
    margin: "0 0 12px",
    fontSize: "1rem",
    fontWeight: 700,
    color: "#335543",
    fontFamily: '"DM Sans", sans-serif',
  },
  options: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  filterButton: {
    borderRadius: "9999px",
    border: "1px solid #989898",
    padding: "8px 14px",
    fontFamily: '"DM Sans", sans-serif',
    fontSize: "0.95rem",
    fontWeight: 400,
    lineHeight: 1,
    cursor: "pointer",
    transition: "background-color 150ms ease, border-color 150ms ease, color 150ms ease",
  },
  filterButtonActive: {
    backgroundColor: "#6d6d6d",
    borderColor: "#6d6d6d",
    color: "white",
  },
  filterButtonInactive: {
    backgroundColor: "#f0f0f0",
    borderColor: "#989898",
    color: "#333",
  },
  divider: {
    borderTop: "1px solid #D1D5DC",
    margin: "4px 0 20px",
  },
  emptyText: {
    margin: 0,
    color: "#666",
    fontFamily: '"DM Sans", sans-serif',
  },
  applyButton: {
    backgroundColor: "#F7AB74",
    color: "black",
    border: "none",
    padding: "10px 20px",
    borderRadius: "20px",
    fontFamily: '"DM Sans", sans-serif',
    fontSize: "0.95rem",
    fontWeight: 400,
    lineHeight: 1,
    cursor: "pointer",
    transition: "background-color 150ms ease, opacity 150ms ease",
  },
};
