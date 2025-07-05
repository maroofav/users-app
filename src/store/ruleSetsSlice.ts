import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Rule, RuleSet } from '@ts/rule.types'
import rulesData from '@data/rulesData.json'

/**
 * Redux slice for managing rule sets in the application.
 *
 * This slice handles the state management for collections of rules (rule sets),
 * including operations like creating, updating, copying, and deleting rule sets
 * and their individual rules.
 */

/**
 * State interface for the rule sets slice
 * @interface RuleSetsState
 * @property {RuleSet[]} ruleSets - Array of all rule sets
 * @property {number | null} selectedRuleSetId - ID of currently selected rule set
 * @property {boolean} isEditMode - Whether a rule set is being edited
 * @property {string} editedRuleSetName - Temporary storage for rule set name being edited
 */
interface RuleSetsState {
  ruleSets: RuleSet[]
  selectedRuleSetId: number | null
  isEditMode: boolean
  editedRuleSetName: string
}

const initialState: RuleSetsState = {
  ruleSets: rulesData.rule_sets,
  selectedRuleSetId: null,
  isEditMode: false,
  editedRuleSetName: '',
}

/**
 * Redux slice containing reducers for rule set management
 *
 * Reducers:
 * - selectRuleSet: Sets the currently selected rule set
 * - addRuleSet: Creates a new rule set
 * - setEditMode: Toggles edit mode and manages edited name state
 * - updateRuleSetName: Updates the temporary edited name
 * - saveRuleSetChanges: Commits name changes to the selected rule set
 * - deleteRuleSet: Removes the selected rule set
 * - addRule: Adds a new rule to the selected rule set
 * - deleteRule: Removes a rule from the selected rule set
 * - updateRule: Modifies an existing rule
 * - copyRuleSet: Creates a duplicate of a rule set with unique IDs
 */
const ruleSetsSlice = createSlice({
  name: 'ruleSets',
  initialState,
  reducers: {
    selectRuleSet(state, action: PayloadAction<number | null>) {
      state.selectedRuleSetId = action.payload
    },

    addRuleSet(
      state,
      action: PayloadAction<{ id: number; name: string; rules: Rule[] }>,
    ) {
      const { id, name, rules } = action.payload

      state.ruleSets.push({ id, name, rules })
      state.selectedRuleSetId = id
    },

    setEditMode(state, action: PayloadAction<boolean>) {
      state.isEditMode = action.payload
      if (action.payload && state.selectedRuleSetId !== null) {
        const selectedRuleSet = state.ruleSets.find(
          (rs) => rs.id === state.selectedRuleSetId,
        )
        if (selectedRuleSet) {
          state.editedRuleSetName = selectedRuleSet.name
        }
      } else {
        state.editedRuleSetName = ''
      }
    },

    updateRuleSetName(state, action: PayloadAction<string>) {
      state.editedRuleSetName = action.payload
    },

    saveRuleSetChanges(state) {
      if (state.selectedRuleSetId !== null) {
        const ruleSetIndex = state.ruleSets.findIndex(
          (rs) => rs.id === state.selectedRuleSetId,
        )
        if (ruleSetIndex !== -1) {
          state.ruleSets[ruleSetIndex].name = state.editedRuleSetName
        }
        state.isEditMode = false
        state.editedRuleSetName = ''
      }
    },

    deleteRuleSet(state) {
      if (state.selectedRuleSetId !== null) {
        state.ruleSets = state.ruleSets.filter(
          (rs) => rs.id !== state.selectedRuleSetId,
        )
        state.selectedRuleSetId = null
        state.isEditMode = false
      }
    },

    addRule(state) {
      if (state.selectedRuleSetId === null) return
      const ruleSetIndex = state.ruleSets.findIndex(
        (rs) => rs.id === state.selectedRuleSetId,
      )
      if (ruleSetIndex !== -1) {
        const newId =
          Math.max(...state.ruleSets[ruleSetIndex].rules.map((r) => r.id), 0) +
          1
        const newRule: Rule = {
          id: newId,
          measurement: '',
          comparator: 'is',
          comparedValue: 'Not Present',
          findingName: '',
          action: 'Normal',
          isNew: true,
        }
        state.ruleSets[ruleSetIndex].rules.push(newRule)
      }
    },

    deleteRule(state, action: PayloadAction<number>) {
      if (state.selectedRuleSetId === null) return
      const ruleSetIndex = state.ruleSets.findIndex(
        (rs) => rs.id === state.selectedRuleSetId,
      )
      if (ruleSetIndex !== -1) {
        state.ruleSets[ruleSetIndex].rules = state.ruleSets[
          ruleSetIndex
        ].rules.filter((r) => r.id !== action.payload)
      }
    },

    updateRule(state, action: PayloadAction<Rule>) {
      if (state.selectedRuleSetId === null) return
      const ruleSetIndex = state.ruleSets.findIndex(
        (rs) => rs.id === state.selectedRuleSetId,
      )
      if (ruleSetIndex !== -1) {
        const ruleIndex = state.ruleSets[ruleSetIndex].rules.findIndex(
          (r) => r.id === action.payload.id,
        )
        if (ruleIndex !== -1) {
          state.ruleSets[ruleSetIndex].rules[ruleIndex] = {
            ...action.payload,
            isNew: false,
            comparedValue:
              action.payload.comparator === 'is'
                ? 'Not Present'
                : Number(action.payload.comparedValue) || '',
            unitName:
              action.payload.comparator === 'is'
                ? undefined
                : action.payload.unitName || '',
          }
        }
      }
    },

    copyRuleSet(state, action: PayloadAction<number>) {
      const selectedRuleSetId = action.payload

      if (selectedRuleSetId === null) return

      const selected = state.ruleSets.find((rs) => rs.id === selectedRuleSetId)
      if (!selected) return

      const baseName = selected.name
      let newName = `${baseName}_(1)`
      let counter = 1

      // Check for existing copies and increment the number to ensure uniqueness
      while (state.ruleSets.some((rs) => rs.name === newName)) {
        counter += 1
        newName = `${baseName}_(${counter})`
      }

      const newId = Math.max(...state.ruleSets.map((rs) => rs.id), 0) + 1
      const maxRuleId = Math.max(
        [...state.ruleSets].reduce(
          (max, rs) => Math.max(max, ...rs.rules.map((r) => r.id)),
          0,
        ),
        0,
      )
      const newRules = selected.rules.map((rule) => ({
        ...rule,
        id: maxRuleId + 1 + selected.rules.indexOf(rule), // Ensure globally unique IDs for new rules
      }))

      state.ruleSets.push({ id: newId, name: newName, rules: newRules })
      state.selectedRuleSetId = newId // Automatically select the new rule set
    },
  },
})

export const {
  selectRuleSet,
  addRuleSet,
  setEditMode,
  updateRuleSetName,
  saveRuleSetChanges,
  deleteRuleSet,
  addRule,
  deleteRule,
  updateRule,
  copyRuleSet,
} = ruleSetsSlice.actions

export default ruleSetsSlice.reducer
