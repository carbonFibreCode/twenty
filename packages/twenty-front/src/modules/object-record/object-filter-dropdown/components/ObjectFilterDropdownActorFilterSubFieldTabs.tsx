import styled from '@emotion/styled';
import { t } from '@lingui/core/macro';

import { useApplyObjectFilterDropdownOperand } from '@/object-record/object-filter-dropdown/hooks/useApplyObjectFilterDropdownOperand';
import { objectFilterDropdownSearchInputComponentState } from '@/object-record/object-filter-dropdown/states/objectFilterDropdownSearchInputComponentState';
import { subFieldNameUsedInDropdownComponentState } from '@/object-record/object-filter-dropdown/states/subFieldNameUsedInDropdownComponentState';
import { isFilterOnActorSourceSubField } from '@/object-record/object-filter-dropdown/utils/isFilterOnActorSourceSubField';
import { isFilterOnActorWorkspaceMemberSubField } from '@/object-record/object-filter-dropdown/utils/isFilterOnActorWorkspaceMemberSubField';
import { RecordFilterOperand } from '@/object-record/record-filter/types/RecordFilterOperand';
import { type CompositeFieldSubFieldName } from '@/settings/data-model/types/CompositeFieldSubFieldName';
import { useRecoilComponentValue } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentValue';
import { useSetRecoilComponentState } from '@/ui/utilities/state/component-state/hooks/useSetRecoilComponentState';

const StyledTabsContainer = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.spacing(1)};
  gap: ${({ theme }) => theme.spacing(1)};
`;

const StyledTab = styled.button<{ isActive: boolean }>`
  background: ${({ theme, isActive }) =>
    isActive
      ? theme.background.transparent.medium
      : theme.background.transparent.lighter};
  border: none;
  border-radius: ${({ theme }) => theme.border.radius.sm};
  color: ${({ theme, isActive }) =>
    isActive ? theme.font.color.primary : theme.font.color.tertiary};
  cursor: pointer;
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(2)}`};

  &:hover {
    background: ${({ theme }) => theme.background.transparent.medium};
    color: ${({ theme }) => theme.font.color.primary};
  }
`;

type ActorSubFieldTab = {
  label: string;
  subFieldName: CompositeFieldSubFieldName;
  defaultOperand: RecordFilterOperand;
};

export const ObjectFilterDropdownActorFilterSubFieldTabs = () => {
  const subFieldNameUsedInDropdown = useRecoilComponentValue(
    subFieldNameUsedInDropdownComponentState,
  );

  const setSubFieldNameUsedInDropdown = useSetRecoilComponentState(
    subFieldNameUsedInDropdownComponentState,
  );

  const setObjectFilterDropdownSearchInput = useSetRecoilComponentState(
    objectFilterDropdownSearchInputComponentState,
  );

  const { applyObjectFilterDropdownOperand } =
    useApplyObjectFilterDropdownOperand();

  const actorSubFieldTabs: ActorSubFieldTab[] = [
    {
      label: t`Name`,
      subFieldName: 'name',
      defaultOperand: RecordFilterOperand.CONTAINS,
    },
    {
      label: t`Workspace member`,
      subFieldName: 'workspaceMemberId',
      defaultOperand: RecordFilterOperand.IS,
    },
    {
      label: t`Source`,
      subFieldName: 'source',
      defaultOperand: RecordFilterOperand.IS,
    },
  ];

  const activeSubFieldName = isFilterOnActorSourceSubField(
    subFieldNameUsedInDropdown,
  )
    ? 'source'
    : isFilterOnActorWorkspaceMemberSubField(subFieldNameUsedInDropdown)
      ? 'workspaceMemberId'
      : 'name';

  const handleTabClick = (tab: ActorSubFieldTab) => {
    setSubFieldNameUsedInDropdown(tab.subFieldName);
    setObjectFilterDropdownSearchInput('');
    applyObjectFilterDropdownOperand(tab.defaultOperand);
  };

  return (
    <StyledTabsContainer>
      {actorSubFieldTabs.map((tab) => (
        <StyledTab
          key={tab.subFieldName}
          isActive={activeSubFieldName === tab.subFieldName}
          onClick={() => handleTabClick(tab)}
        >
          {tab.label}
        </StyledTab>
      ))}
    </StyledTabsContainer>
  );
};
