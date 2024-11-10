import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import styles from "../styles/OwnerDropdown.module.css";

// Forwarding ref to allow Dropdown to access the DOM node for positioning
const MenuIcon = React.forwardRef(({ onClick }, ref) => (
  <i
    className="fas fa-ellipsis-v"
    ref={ref}
    onClick={(event) => {
      event.preventDefault();
      onClick(event);
    }}
  />
));

export const OwnerDropdown = ({ onEdit, onDelete }) => {
  return (
    <Dropdown className="ml-auto" drop="left">
      <Dropdown.Toggle as={MenuIcon} />

      <Dropdown.Menu
        className="text-center"
        popperConfig={{ strategy: "fixed" }}
      >
        <Dropdown.Item
          className={styles.DropdownItem}
          onClick={onEdit}
          aria-label="edit"
        >
          <i className="fas fa-edit" />
        </Dropdown.Item>
        <Dropdown.Item
          className={styles.DropdownItem}
          onClick={onDelete}
          aria-label="delete"
        >
          <i className="fas fa-trash-alt" />
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};