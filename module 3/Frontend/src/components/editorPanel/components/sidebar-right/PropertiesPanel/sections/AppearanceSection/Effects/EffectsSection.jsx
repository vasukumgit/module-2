import React, { useState } from "react";

import EffectItem from "./EffectItem";

import plus from "../../../../../../../../assets/editor-panel/properties/plus.svg";

import { updateAppearance }
from "../appearanceApi";

export default function EffectsSection({
  selectedElementId,
}) {

  const [effects, setEffects] =
    useState([
      {
        id: 1,
        type: "Drop Shadow",
        visible: true,
      },

      {
        id: 2,
        type: "Inner Glow",
        visible: true,
      },
    ]);

  // =========================
  // ADD EFFECT
  // =========================

  const addEffect = async () => {

    const updatedEffects = [
      ...effects,

      {
        id: Date.now(),
        type: "Drop Shadow",
        visible: true,
      },
    ];

    setEffects(updatedEffects);

    await updateAppearance(
      selectedElementId,
      {
        effects: updatedEffects,
      }
    );
  };

  // =========================
  // DELETE EFFECT
  // =========================

  const deleteEffect = async (id) => {

    const updatedEffects =
      effects.filter(
        (effect) => effect.id !== id
      );

    setEffects(updatedEffects);

    await updateAppearance(
      selectedElementId,
      {
        effects: updatedEffects,
      }
    );
  };

  // =========================
  // TOGGLE EFFECT
  // =========================

  const toggleEffect = async (id) => {

    const updatedEffects =
      effects.map((effect) =>

        effect.id === id
          ? {
              ...effect,
              visible:
                !effect.visible,
            }
          : effect
      );

    setEffects(updatedEffects);

    await updateAppearance(
      selectedElementId,
      {
        effects: updatedEffects,
      }
    );
  };

  return (

    <div className="block">

      <div className="block-header">

        <span>Effects</span>

        <button
          type="button"
          className="icon-btn"
          onClick={addEffect}
        >
          <img src={plus} alt="" />
        </button>

      </div>

      {effects.map((effect) => (

        <EffectItem
          key={effect.id}
          name={effect.type}
          visible={effect.visible}
          onDelete={() =>
            deleteEffect(effect.id)
          }
          onToggle={() =>
            toggleEffect(effect.id)
          }
        />

      ))}

    </div>
  );
}