'use client'

// Third-party Imports
import styled from '@emotion/styled'

// Util Imports
import { commonLayoutClasses, verticalLayoutClasses } from '@layouts/utils/layoutClasses'

const StyledContentWrapper = styled.div`
  &:has(.${verticalLayoutClasses.content}>.${commonLayoutClasses.contentHeightFixed}) {
    max-block-size: 100dvh;
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ensure the wrapper takes the full viewport height */
  flex-grow: 1;      /* Make the content grow to fill the remaining space */
`

export default StyledContentWrapper
