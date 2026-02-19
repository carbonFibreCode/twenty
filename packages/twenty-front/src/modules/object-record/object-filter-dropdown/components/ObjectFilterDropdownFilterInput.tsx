import { ObjectFilterDropdownActorFilterSubFieldTabs } from '@/object-record/object-filter-dropdown/components/ObjectFilterDropdownActorFilterSubFieldTabs';
import { ObjectFilterDropdownActorSelect } from '@/object-record/object-filter-dropdown/components/ObjectFilterDropdownActorSelect';
import { ObjectFilterDropdownDateInput } from '@/object-record/object-filter-dropdown/components/ObjectFilterDropdownDateInput';
import { ObjectFilterDropdownNumberInput } from '@/object-record/object-filter-dropdown/components/ObjectFilterDropdownNumberInput';
import { ObjectFilterDropdownOptionSelect } from '@/object-record/object-filter-dropdown/components/ObjectFilterDropdownOptionSelect';
import { ObjectFilterDropdownRatingInput } from '@/object-record/object-filter-dropdown/components/ObjectFilterDropdownRatingInput';
import { ObjectFilterDropdownRecordSelect } from '@/object-record/object-filter-dropdown/components/ObjectFilterDropdownRecordSelect';
import { ObjectFilterDropdownSearchInput } from '@/object-record/object-filter-dropdown/components/ObjectFilterDropdownSearchInput';
import { ObjectFilterDropdownSourceSelect } from '@/object-record/object-filter-dropdown/components/ObjectFilterDropdownSourceSelect';
import { DropdownMenuSeparator } from '@/ui/layout/dropdown/components/DropdownMenuSeparator';
import { useFeatureFlagsMap } from '@/workspace/hooks/useFeatureFlagsMap';

import { ViewFilterOperand } from 'twenty-shared/types';

import { ObjectFilterDropdownBooleanSelect } from '@/object-record/object-filter-dropdown/components/ObjectFilterDropdownBooleanSelect';
import { ObjectFilterDropdownDateTimeInput } from '@/object-record/object-filter-dropdown/components/ObjectFilterDropdownDateTimeInput';
import { ObjectFilterDropdownInnerSelectOperandDropdown } from '@/object-record/object-filter-dropdown/components/ObjectFilterDropdownInnerSelectOperandDropdown';
import { ObjectFilterDropdownTextInput } from '@/object-record/object-filter-dropdown/components/ObjectFilterDropdownTextInput';
import { NUMBER_FILTER_TYPES } from '@/object-record/object-filter-dropdown/constants/NumberFilterTypes';
import { TEXT_FILTER_TYPES } from '@/object-record/object-filter-dropdown/constants/TextFilterTypes';
import { fieldMetadataItemUsedInDropdownComponentSelector } from '@/object-record/object-filter-dropdown/states/fieldMetadataItemUsedInDropdownComponentSelector';
import { selectedOperandInDropdownComponentState } from '@/object-record/object-filter-dropdown/states/selectedOperandInDropdownComponentState';
import { subFieldNameUsedInDropdownComponentState } from '@/object-record/object-filter-dropdown/states/subFieldNameUsedInDropdownComponentState';
import { isFilterOnActorSourceSubField } from '@/object-record/object-filter-dropdown/utils/isFilterOnActorSourceSubField';
import { isFilterOnActorWorkspaceMemberSubField } from '@/object-record/object-filter-dropdown/utils/isFilterOnActorWorkspaceMemberSubField';
import { useRecoilComponentValue } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentValue';
import { getFilterTypeFromFieldType, isDefined } from 'twenty-shared/utils';

type ObjectFilterDropdownFilterInputProps = {
  filterDropdownId: string;
  recordFilterId?: string;
};

export const ObjectFilterDropdownFilterInput = ({
  filterDropdownId,
  recordFilterId,
}: ObjectFilterDropdownFilterInputProps) => {
  const featureFlags = useFeatureFlagsMap();
  const isWholeDayFilterEnabled =
    featureFlags.IS_DATE_TIME_WHOLE_DAY_FILTER_ENABLED ?? false;

  const fieldMetadataItemUsedInDropdown = useRecoilComponentValue(
    fieldMetadataItemUsedInDropdownComponentSelector,
  );

  const selectedOperandInDropdown = useRecoilComponentValue(
    selectedOperandInDropdownComponentState,
  );

  const subFieldNameUsedInDropdown = useRecoilComponentValue(
    subFieldNameUsedInDropdownComponentState,
  );

  const isActorSourceFilter = isFilterOnActorSourceSubField(
    subFieldNameUsedInDropdown,
  );

  const isActorWorkspaceMemberFilter = isFilterOnActorWorkspaceMemberSubField(
    subFieldNameUsedInDropdown,
  );

  const isOperandWithFilterValue =
    selectedOperandInDropdown &&
    [
      ViewFilterOperand.IS,
      ViewFilterOperand.IS_NOT_NULL,
      ViewFilterOperand.IS_NOT,
      ViewFilterOperand.LESS_THAN_OR_EQUAL,
      ViewFilterOperand.GREATER_THAN_OR_EQUAL,
      ViewFilterOperand.IS_BEFORE,
      ViewFilterOperand.IS_AFTER,
      ViewFilterOperand.CONTAINS,
      ViewFilterOperand.DOES_NOT_CONTAIN,
      ViewFilterOperand.IS_RELATIVE,
    ].includes(selectedOperandInDropdown);

  if (!isDefined(fieldMetadataItemUsedInDropdown)) {
    return null;
  }

  const filterType = getFilterTypeFromFieldType(
    fieldMetadataItemUsedInDropdown.type,
  );

  const isOnlyOperand = !isOperandWithFilterValue;

  if (isOnlyOperand) {
    return (
      <>
        <ObjectFilterDropdownInnerSelectOperandDropdown />
      </>
    );
  } else if (filterType === 'DATE') {
    return (
      <>
        <ObjectFilterDropdownInnerSelectOperandDropdown />
        <DropdownMenuSeparator />
        <ObjectFilterDropdownDateInput />
      </>
    );
  } else if (filterType === 'DATE_TIME') {
    if (
      isWholeDayFilterEnabled &&
      selectedOperandInDropdown === ViewFilterOperand.IS
    ) {
      return (
        <>
          <ObjectFilterDropdownInnerSelectOperandDropdown />
          <DropdownMenuSeparator />
          <ObjectFilterDropdownDateInput />
        </>
      );
    }
    return (
      <>
        <ObjectFilterDropdownInnerSelectOperandDropdown />
        <DropdownMenuSeparator />
        <ObjectFilterDropdownDateTimeInput />
      </>
    );
  } else {
    return (
      <>
        <ObjectFilterDropdownInnerSelectOperandDropdown />
        <DropdownMenuSeparator />
        {TEXT_FILTER_TYPES.includes(filterType) && (
          <ObjectFilterDropdownTextInput filterDropdownId={filterDropdownId} />
        )}
        {NUMBER_FILTER_TYPES.includes(filterType) && (
          <ObjectFilterDropdownNumberInput
            filterDropdownId={filterDropdownId}
          />
        )}
        {filterType === 'RATING' && <ObjectFilterDropdownRatingInput />}
        {filterType === 'RELATION' && (
          <>
            <ObjectFilterDropdownSearchInput />
            <DropdownMenuSeparator />
            <ObjectFilterDropdownRecordSelect
              recordFilterId={recordFilterId}
              dropdownId={filterDropdownId}
            />
          </>
        )}
        {filterType === 'ACTOR' && (
          <>
            <ObjectFilterDropdownActorFilterSubFieldTabs />
            <DropdownMenuSeparator />
            {isActorSourceFilter ? (
              <>
                <ObjectFilterDropdownSearchInput />
                <DropdownMenuSeparator />
                <ObjectFilterDropdownSourceSelect
                  dropdownId={filterDropdownId}
                />
              </>
            ) : isActorWorkspaceMemberFilter ? (
              <>
                <ObjectFilterDropdownSearchInput />
                <DropdownMenuSeparator />
                <ObjectFilterDropdownActorSelect
                  dropdownId={filterDropdownId}
                />
              </>
            ) : (
              <ObjectFilterDropdownTextInput
                filterDropdownId={filterDropdownId}
              />
            )}
          </>
        )}
        {filterType === 'ADDRESS' && (
          <ObjectFilterDropdownTextInput filterDropdownId={filterDropdownId} />
        )}
        {filterType === 'CURRENCY' && (
          <ObjectFilterDropdownNumberInput
            filterDropdownId={filterDropdownId}
          />
        )}
        {['SELECT', 'MULTI_SELECT'].includes(filterType) && (
          <>
            <ObjectFilterDropdownSearchInput />
            <DropdownMenuSeparator />
            <ObjectFilterDropdownOptionSelect focusId={filterDropdownId} />
          </>
        )}
        {filterType === 'BOOLEAN' && <ObjectFilterDropdownBooleanSelect />}
      </>
    );
  }
};
