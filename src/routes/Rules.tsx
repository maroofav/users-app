import {
  useMemo,
  useCallback,
  useRef,
  memo,
  useState,
  ChangeEvent,
} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { shallowEqual } from 'react-redux'

import { Box, Divider, Button, TextField, MenuItem } from '@mui/material'

import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  GridRowModesModel,
  GridAlignment,
} from '@mui/x-data-grid'

import EditIcon from '@mui/icons-material/EditOutlined'
import DeleteIcon from '@mui/icons-material/DeleteTwoTone'
import SaveIcon from '@mui/icons-material/DoneAll'
import CancelIcon from '@mui/icons-material/CancelTwoTone'

import { RootState } from '@store/index'

import {
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
} from '@store/ruleSetsSlice'

import EditTextComponent from '@components/Rules/EditTextComponent'
import RuleSetSelector from '@components/Rules/RuleSetSelector'

import { Rule } from '@ts/rule.types'

/**
 * @component Rules
 * @description A complex data grid interface for managing rule sets and their associated rules.
 * This component provides functionality to create, edit, delete, and copy rule sets and individual rules.
 *
 * Key Features:
 * - Rule set selection and management
 * - Rule creation and editing
 * - Data grid display of rules with inline editing
 * - Copy functionality for rule sets
 *
 * State Management:
 * - Uses Redux for global state management
 * - Local state for row editing modes
 *
 * Main Components:
 * 1. Rule Set Selector - Dropdown to select or create rule sets
 * 2. Action Buttons - Context-aware buttons for rule set operations
 * 3. Data Grid - Display and editing interface for rules
 *
 * Rule Properties:
 * - id: Unique identifier
 * - measurement: Name of the measurement
 * - comparator: Comparison operator ('is', '>=', '<')
 * - comparedValue: Value to compare against
 * - unitName: Unit of measurement (s, ms)
 * - findingName: Name of the finding
 * - action: Result action (Normal, Reflux)
 *
 * @memo This component is memoized to prevent unnecessary re-renders
 */

const Rules = memo(() => {
  const dispatch = useDispatch()
  const { ruleSets, selectedRuleSetId, isEditMode, editedRuleSetName } =
    useSelector(
      (state: RootState) => ({
        ruleSets: state.ruleSets.ruleSets,
        selectedRuleSetId: state.ruleSets.selectedRuleSetId,
        isEditMode: state.ruleSets.isEditMode,
        editedRuleSetName: state.ruleSets.editedRuleSetName,
      }),
      shallowEqual,
    )

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const gridRef = useRef<HTMLDivElement>(null)
  const selectedRuleSet = useMemo(
    () => ruleSets.find((rs) => rs.id === selectedRuleSetId),
    [ruleSets, selectedRuleSetId],
  )
  const rules = useMemo(() => selectedRuleSet?.rules || [], [selectedRuleSet])

  const hasUnsavedNewRule = useMemo(
    () =>
      Object.values(rowModesModel).some(
        (mode) =>
          mode.mode === GridRowModes.Edit &&
          rules.some(
            (rule) =>
              rule.id ===
                Number(
                  Object.keys(rowModesModel).find(
                    (key) =>
                      rowModesModel[Number(key)]?.mode === GridRowModes.Edit,
                  ),
                ) && rule.isNew,
          ),
      ),
    [rowModesModel, rules],
  )

  const handleRuleSetChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      if (value === 'add-new') {
        const newId = Math.max(...ruleSets.map((rs) => rs.id), 0) + 1
        const newName = `New Rule Set ${newId}`
        dispatch({
          type: addRuleSet.type,
          payload: { id: newId, name: newName, rules: [] },
        })
        dispatch(selectRuleSet(newId))
      } else {
        dispatch(selectRuleSet(Number(value)))
      }
    },
    [dispatch, ruleSets],
  )

  const handleEditRules = useCallback(() => {
    if (selectedRuleSetId !== null) {
      dispatch(setEditMode(true))
    }
  }, [dispatch, selectedRuleSetId])

  const handleCopyRuleset = useCallback(() => {
    if (selectedRuleSetId === null) {
      console.warn('No rule set selected for copying')
      return
    }
    dispatch(copyRuleSet(selectedRuleSetId))
  }, [dispatch, selectedRuleSetId])

  const handleSaveChanges = useCallback(() => {
    if (selectedRuleSetId !== null) {
      dispatch(saveRuleSetChanges())
    }
  }, [dispatch, selectedRuleSetId])

  const handleCancel = useCallback(() => {
    if (window.confirm('Sure you want to cancel?')) {
      dispatch(setEditMode(false))
      setRowModesModel({})
    }
  }, [dispatch])

  const handleAddNewRule = useCallback(() => {
    if (selectedRuleSetId === null || hasUnsavedNewRule) return
    dispatch(addRule())
    const newId = Math.max(...rules.map((r) => r.id), 0) + 1
    setRowModesModel((prev) => ({
      ...prev,
      [newId]: { mode: GridRowModes.Edit },
    }))
    setTimeout(() => {
      if (gridRef.current) {
        const scrollerGridElement = gridRef.current.querySelector(
          '.MuiDataGrid-virtualScroller',
        ) as HTMLElement
        const scrollHeight = scrollerGridElement?.scrollHeight || 999999
        const scrollLeft = scrollerGridElement?.scrollLeft || 0
        scrollerGridElement?.scrollTo({
          top: scrollHeight,
          left: scrollLeft,
          behavior: 'smooth',
        })
      }
    }, 10)
  }, [dispatch, selectedRuleSetId, rules, hasUnsavedNewRule])

  const handleDeleteRuleSet = useCallback(() => {
    if (
      selectedRuleSetId !== null &&
      window.confirm('Sure you want to delete this rule set?')
    ) {
      dispatch(deleteRuleSet())
    }
  }, [dispatch, selectedRuleSetId])

  const handleEditClick = useCallback(
    (id: number) => () => {
      // Exit edit mode for all other rows before entering edit mode for the selected row
      setRowModesModel((prev) => {
        const newModel = { ...prev }
        Object.keys(newModel).forEach((key) => {
          newModel[Number(key)] = { mode: GridRowModes.View }
        })

        newModel[id] = { mode: GridRowModes.Edit }
        return newModel
      })
    },
    [],
  )

  const handleSaveClick = useCallback(
    (id: number) => () => {
      setRowModesModel((prev) => ({
        ...prev,
        [id]: { mode: GridRowModes.View },
      }))
    },
    [],
  )

  const handleCancelClick = useCallback(
    (id: number) => () => {
      setRowModesModel((prev) => ({
        ...prev,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      }))
      const rule = rules.find((r) => r.id === id)
      if (rule?.isNew) {
        dispatch(deleteRule(id))
      }
    },
    [dispatch, rules],
  )

  const handleDeleteClick = useCallback(
    (id: number) => () => {
      if (selectedRuleSetId === null) return
      if (window.confirm('Sure you want to delete this rule?')) {
        dispatch(deleteRule(id))
      }
    },
    [dispatch, selectedRuleSetId],
  )

  const processRowUpdate = useCallback(
    (newRow: Rule) => {
      dispatch(updateRule(newRow))
      return newRow
    },
    [dispatch],
  )

  const getGridActions = useCallback(
    (id: number, isInEditMode: boolean) => {
      if (isInEditMode) {
        return [
          <GridActionsCellItem
            key="save"
            icon={<SaveIcon color="action" />}
            label="Save"
            onClick={handleSaveClick(id)}
          />,
          <GridActionsCellItem
            key="cancel"
            icon={<CancelIcon color="action" />}
            label="Cancel"
            onClick={handleCancelClick(id)}
          />,
        ]
      }
      return [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon color="disabled" />}
          label="Edit"
          onClick={handleEditClick(id)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon color="action" />}
          label="Delete"
          onClick={handleDeleteClick(id)}
        />,
      ]
    },
    [handleSaveClick, handleCancelClick, handleEditClick, handleDeleteClick],
  )

  const columns = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'Rule #',
        width: 150,
        headerAlign: 'center' as GridAlignment,
        align: 'center' as GridAlignment,
      },
      {
        field: 'measurement',
        headerName: '',
        width: 200,
        editable: isEditMode,
        sortable: false,
        align: 'center' as GridAlignment,
        renderEditCell: (params) => (
          <EditTextComponent {...params} placeholder="Enter measurement name" />
        ),
      },
      {
        field: 'comparator',
        headerName: 'Measurement Condition',
        width: 230,
        editable: isEditMode,
        type: 'singleSelect' as const,
        valueOptions: ['is', '>=', '<'],
        renderCell: (params) => {
          return params.row.comparator === 'is' ||
            params.row.comparator === 'not present'
            ? 'is'
            : `${params.row.comparator}`
        },
        align: 'center' as GridAlignment,
      },
      {
        field: 'comparedValue',
        headerName: '',
        sortable: false,
        width: 140,
        editable: isEditMode,
        renderCell: (params) =>
          params.row.comparator === 'is' ||
          params.row.comparator === 'not present'
            ? 'Not Present'
            : `${params.value}${
                params.row.unitName ? ` ${params.row.unitName}` : ''
              }`,
        renderEditCell: (params) => (
          <Box sx={{ display: 'flex', gap: '2px' }}>
            {params.row.comparator === 'is' ? (
              <TextField
                inputProps={{
                  readOnly: true,
                }}
                value="Not Present"
                size="small"
              />
            ) : (
              <TextField
                type="number"
                value={params.value || '0.1'}
                onChange={(e) =>
                  params.api.setEditCellValue({
                    id: params.id,
                    field: 'comparedValue',
                    value: e.target.value,
                  })
                }
                size="small"
                sx={{ width: 78 }}
                InputProps={{
                  inputProps: { min: 0 },
                }}
              />
            )}
            {params.row.comparator !== 'is' && (
              <TextField
                select
                value={params.row.unitName || ''}
                onChange={(e) => {
                  const updatedRow = { ...params.row, unitName: e.target.value }
                  params.api.setEditCellValue({
                    id: params.id,
                    field: 'unitName',
                    value: e.target.value,
                  })
                  params.api.updateRows([updatedRow])
                }}
                size="small"
                sx={{
                  width: 58,
                  '& .MuiOutlinedInput-root': {
                    height: '100%',
                  },
                }}
                placeholder="Select Unit"
              >
                <MenuItem value="Select Unit" disabled selected>
                  Select Unit
                </MenuItem>
                <MenuItem value="s">s</MenuItem>
                <MenuItem value="ms">ms</MenuItem>
              </TextField>
            )}
          </Box>
        ),
        align: 'center' as GridAlignment,
      },
      {
        field: 'findingName',
        headerName: 'Finding Item',
        width: 200,
        editable: isEditMode,
        headerAlign: 'center' as GridAlignment,
        align: 'center' as GridAlignment,
        renderEditCell: (params) => (
          <EditTextComponent {...params} placeholder="Enter finding's name" />
        ),
      },
      {
        field: 'action',
        headerName: 'Action',
        width: 130,
        editable: isEditMode,
        type: 'singleSelect' as const,
        valueOptions: ['Normal', 'Reflux'],
        headerAlign: 'center' as GridAlignment,
        align: 'center' as GridAlignment,
        cellClassName: 'font-bold text-gray-700',
      },
      ...(isEditMode
        ? [
            {
              field: 'actions',
              type: 'actions' as const,
              headerName: ' ',
              width: 100,
              cellClassName: 'actions',
              getActions: ({ id }) => {
                const isInEditMode =
                  rowModesModel[id]?.mode === GridRowModes.Edit
                return getGridActions(id, isInEditMode)
              },
            },
          ]
        : []),
    ],
    [isEditMode, rowModesModel, getGridActions],
  )

  const ActionButtons = useCallback(
    ({ isEditMode }) => (
      <Box
        sx={{ display: 'inline-flex', flexWrap: 'wrap', gap: 4, mb: 2, ml: 4 }}
      >
        {isEditMode ? (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveChanges}
            >
              Save Changes
            </Button>
            <Button variant="contained" color="inherit" onClick={handleCancel}>
              Cancel
            </Button>
            <Divider sx={{ my: 0 }} orientation="vertical" flexItem />
            <Button
              variant="contained"
              color="success"
              onClick={handleAddNewRule}
              disabled={hasUnsavedNewRule}
            >
              Add New Rule
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteRuleSet}
            >
              Delete Ruleset
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              color="inherit"
              onClick={handleEditRules}
              disabled={selectedRuleSetId === null}
            >
              Edit Rules
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCopyRuleset}
              disabled={selectedRuleSetId === null}
            >
              Copy Ruleset
            </Button>
          </>
        )}
      </Box>
    ),
    [
      handleSaveChanges,
      handleCancel,
      handleAddNewRule,
      hasUnsavedNewRule,
      handleDeleteRuleSet,
      handleEditRules,
      handleCopyRuleset,
      selectedRuleSetId,
    ],
  )

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto', mt: 5 }}>
      {isEditMode ? (
        <TextField
          size="small"
          value={editedRuleSetName}
          onChange={(e) => dispatch(updateRuleSetName(e.target.value))}
          fullWidth
          sx={{ mb: 2, maxWidth: 400 }}
        />
      ) : (
        <RuleSetSelector
          value={selectedRuleSetId}
          onChange={handleRuleSetChange}
          ruleSets={ruleSets}
        />
      )}

      <ActionButtons isEditMode={isEditMode} />

      <Box sx={{ height: 500, width: '100%' }} ref={gridRef}>
        <DataGrid
          rows={rules}
          columns={columns}
          rowHeight={37}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={setRowModesModel}
          processRowUpdate={processRowUpdate}
          disableColumnResize
          hideFooter
        />
      </Box>
    </Box>
  )
})

export default Rules
