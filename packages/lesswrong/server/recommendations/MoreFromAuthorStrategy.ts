import RecommendationStrategy from "./RecommendationStrategy";
import type { StrategySpecification } from "../../lib/collections/users/recommendationSettings";

class MoreFromAuthorStrategy extends RecommendationStrategy {
  async recommend(
    currentUser: DbUser|null,
    count: number,
    strategy: StrategySpecification,
  ): Promise<DbPost[]> {
    const {postId, authorId} = strategy;
    if (!postId) {
      throw new Error("No post specified in recommendation strategy");
    }
    if (!authorId) {
      throw new Error("No author specified in recommendation strategy");
    }
    return this.recommendDefaultWithPostFilter(
      currentUser,
      count,
      postId,
      `AND p."userId" = $(userId)`,
    );
  };
}

export default MoreFromAuthorStrategy;
