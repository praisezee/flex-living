const approvalStore: Map<string, boolean> = new Map()

export function setApproval(reviewId: string, approved: boolean) {
  approvalStore.set(reviewId, approved)
}

export function getApproval(reviewId: string): boolean | undefined {
  return approvalStore.get(reviewId)
}

export function getAllApprovals(): Record<string, boolean> {
  return Object.fromEntries(approvalStore)
}

export function resetApprovals() {
  approvalStore.clear()
}
