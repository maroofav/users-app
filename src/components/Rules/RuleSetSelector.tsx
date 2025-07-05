import { memo } from 'react'
import { TextField, MenuItem } from '@mui/material'
import { RuleSetSelectorProps } from '@ts/rule.types'

/**
 * A dropdown component for selecting a rule set from a list of options.
 * Includes a disabled placeholder option and an "Add New Ruleset" option.
 *
 * @param props - The component props
 * @param props.value - Currently selected rule set ID, or null if none selected
 * @param props.onChange - Callback function triggered when selection changes
 * @param props.ruleSets - Array of available rule sets to choose from
 * @returns A Material-UI TextField component configured as a select dropdown
 */
const RuleSetSelector = ({
  value,
  onChange,
  ruleSets,
}: RuleSetSelectorProps) => (
  <TextField
    size="small"
    select
    value={value === null ? 'none' : value}
    onChange={onChange}
    fullWidth
    sx={{
      mb: 2,
      maxWidth: 600,
      '& .MuiInputBase-root': {
        height: '34px',
      },
    }}
  >
    <MenuItem value="none" disabled>
      Select a Rule Set
    </MenuItem>
    {ruleSets.map((rs) => (
      <MenuItem key={rs.id} value={rs.id}>
        {rs.name}
      </MenuItem>
    ))}
    <MenuItem value="add-new">+ Add New Ruleset</MenuItem>
  </TextField>
)

export default memo(RuleSetSelector)
