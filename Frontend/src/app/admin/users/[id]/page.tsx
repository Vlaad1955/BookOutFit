import React from "react";
import UsersList from "@/admin/users/components/list/UsersList";
import Pagination from "@/admin/other/components/pagination/Pagination";
import { getAllUsers } from "@/admin/users/api/users";

type Params = { id: string };

export default async function UsersPage({ params }: { params: Params }) {
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    const page = parseInt(id, 10) || 1;

    const data = await getAllUsers({ page });

    return (
        <div>
            <UsersList users={data.entities} />
            <Pagination currentPage={data.page} totalPages={data.pages} searchName="users" />
        </div>
    );
}
