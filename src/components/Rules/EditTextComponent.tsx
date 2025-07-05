import { TextField } from '@mui/material'
import { useGridApiContext, GridRenderEditCellParams } from '@mui/x-data-grid'
import { memo, useCallback, ChangeEvent } from 'react'

/**
 * A memoized component for editing text cells in a MUI DataGrid.
 *
 * @component
 * @param {GridRenderEditCellParams} props - The props passed from the DataGrid
 * @param {string|number} props.id - The row id
 * @param {any} props.value - The current cell value
 * @param {string} props.field - The field name/column identifier
 * @param {string} props.placeholder - Placeholder text for the TextField
 * @returns {JSX.Element} A Material-UI TextField component
 */
const EditTextComponent = memo((props: GridRenderEditCellParams) => {
  const { id, value, field, placeholder } = props
  const apiRef = useGridApiContext()

  // Memoize the change handler to prevent unnecessary re-renders
  const handleValueChange = useCallback(
    ({ target: { value: newValue } }: ChangeEvent<HTMLInputElement>) => {
      // Early return if value hasn't changed
      if (newValue === value) return

      // For numeric fields, validate and convert in one step
      if (typeof value === 'number') {
        const numValue = Number(newValue)
        if (isNaN(numValue)) return
        apiRef.current.setEditCellValue({ id, field, value: numValue })
        return
      }

      // For text fields, update directly
      apiRef.current.setEditCellValue({ id, field, value: newValue })
    },
    [apiRef, id, field, value],
  )

  return (
    <TextField
      value={value ?? ''}
      onChange={handleValueChange}
      fullWidth
      variant="outlined"
      size="small"
      placeholder={placeholder}
    />
  )
})

EditTextComponent.displayName = 'EditTextComponent'

export default EditTextComponent
