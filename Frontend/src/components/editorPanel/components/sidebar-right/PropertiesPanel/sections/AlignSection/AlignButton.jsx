const AlignButton = ({
  icon,
  label,
  position,
  onClick,
}) => {
  return (
    <button
      className={`align-btn align-${position}`}
      title={label}
      onClick={onClick}
    >
      <div className="align-btn-inner">
        <img
          src={icon}
          alt={label}
          className="align-icon"
        />
      </div>
    </button>
  );
};

export default AlignButton;