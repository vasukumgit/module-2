import AlignButton from "./AlignButton"
import axios from "axios";

const AlignGroup = ({ options, className = "", onSelect }) => {
return (
    <div className={`align-group ${className}`}>
      {options.map((item, index) => {
        let position = "middle";

        if (index === 0) position = "first";
        else if (index === options.length - 1)
          position = "last";

        return (
          <AlignButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            position={position}
            onClick={() =>
              onSelect(item.type, item.value)
            }
          />
        );
      })}
    </div>
  );

};

export default AlignGroup;